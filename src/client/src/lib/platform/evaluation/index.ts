import getMessage from "@/constants/messages";
import { getCurrentUser } from "@/lib/session";
import { throwIfError } from "@/utils/error";
import Sanitizer from "@/utils/sanitizer";
import { dataCollector } from "../common";
import { OPENLIT_EVALUATION_TABLE_NAME } from "./table-details";
import { spawn } from "child_process";
import { getEvaluationConfig } from "./config";
import asaw from "@/utils/asaw";
import { EvaluationConfig } from "@/types/evaluation";
import { consoleLog } from "@/utils/log";

export async function getEvaluationsForSpanId(spanId: string) {
	const user = await getCurrentUser();

	throwIfError(!user, getMessage().UNAUTHORIZED_USER);
	const sanitizedSpanId = Sanitizer.sanitizeValue(spanId);

	const query = `
		SELECT 
			span_id as spanId,
			created_at as createdAt,
			id,
			arrayMap(
					(e, c, ex, v) -> 
					('type', e, 'score', if(mapContains(scores, e), scores[e], 0.0), 'classification', c, 'explanation', ex, 'verdict', v),
					evaluationData.evaluation,
					evaluationData.classification,
					evaluationData.explanation,
					evaluationData.verdict
			) AS evaluations
		FROM ${OPENLIT_EVALUATION_TABLE_NAME}
		WHERE spanId = '${sanitizedSpanId}'
		ORDER BY created_at;
	`;

	const { data, err } = await dataCollector({ query });

	if (err) {
		return { err };
	}

	if (!(data as any[])?.length) {
		const [evaluationConfigErr, evaluationConfig] = await asaw(
			getEvaluationConfig()
		);
		const evaluationConfigTyped = evaluationConfig as EvaluationConfig;
		if (evaluationConfigErr) {
			return { configErr: evaluationConfigErr };
		}
		if (!evaluationConfigTyped?.id) {
			return { configErr: getMessage().EVALUATION_CONFIG_NOT_FOUND };
		}
		return { config: evaluationConfigTyped.id };
	}
	return { data };
}

export async function setEvaluationsForSpanId(spanId: string) {
	const user = await getCurrentUser();

	throwIfError(!user, getMessage().UNAUTHORIZED_USER);
	const sanitizedSpanId = Sanitizer.sanitizeValue(spanId);

	const evaluationConfig = await getEvaluationConfig(undefined, false);

	try {
		const data = await new Promise((resolve) => {
			const pythonProcess = spawn("python3", [
				"scripts/evaluation.py",
				sanitizedSpanId,
				evaluationConfig.provider,
				evaluationConfig.model,
				evaluationConfig.secret.value,
			]);

			let output = "";
			let errorOutput = "";

			pythonProcess.stdout.on("data", (data) => {
				output += data.toString();
			});

			pythonProcess.stderr.on("data", (data) => {
				errorOutput += data.toString();
			});

			pythonProcess.on("close", (code) => {
				if (code === 0) {
					resolve({ success: true, output });
				} else {
					resolve({ success: false, error: errorOutput });
				}
			});
		});

		// Add the data to the database below
		return data;
	} catch (e) {
		consoleLog(e);
	}
}
