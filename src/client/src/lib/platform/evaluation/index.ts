import getMessage from "@/constants/messages";
import { getCurrentUser } from "@/lib/session";
import { throwIfError } from "@/utils/error";
import Sanitizer from "@/utils/sanitizer";
import { dataCollector } from "../common";
import { OPENLIT_EVALUATION_TABLE_NAME } from "./table-details";
import { spawn } from "child_process";

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
            (e, c, ex, v, s) -> 
            ('type', e, 'score', if(hasKey(scores, e), scores[e], 0.0), 'classification', c, 'explanation', ex, 'verdict', v),
            evaluationData.evaluation,
            evaluationData.classification,
            evaluationData.explanation,
            evaluationData.verdict,
            evaluationData.evaluation
        ) AS evaluations
    FROM ${OPENLIT_EVALUATION_TABLE_NAME}
    WHERE span_id = '${sanitizedSpanId}'
    ORDER BY created_at;
  `;

	return await dataCollector({ query });
}

export async function setEvaluationsForSpanId(spanId: string) {
	const user = await getCurrentUser();

	throwIfError(!user, getMessage().UNAUTHORIZED_USER);
	const sanitizedSpanId = Sanitizer.sanitizeValue(spanId);

	try {
		const data = await new Promise((resolve) => {
			const pythonProcess = spawn("python3", [
				"scripts/evaluation.py",
				sanitizedSpanId
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
    return data;
	} catch (e) {
		console.log(e);
	}

	// const response

	// const query = `
	//   SELECT
	//       span_id as spanId,
	//       created_at as createdAt,
	//       id,
	//       arrayMap(
	//           (e, c, ex, v, s) ->
	//           ('type', e, 'score', if(hasKey(scores, e), scores[e], 0.0), 'classification', c, 'explanation', ex, 'verdict', v),
	//           evaluationData.evaluation,
	//           evaluationData.classification,
	//           evaluationData.explanation,
	//           evaluationData.verdict,
	//           evaluationData.evaluation
	//       ) AS evaluations
	//   FROM ${OPENLIT_EVALUATION_TABLE_NAME}
	//   WHERE span_id = '${sanitizedSpanId}'
	//   ORDER BY created_at;
	// `;

	// return await dataCollector({ query });
}
