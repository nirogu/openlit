import {
	getEvaluationConfig,
	setEvaluationConfig,
} from "@/lib/platform/evaluation/config";
import { EvaluationConfigInput } from "@/types/evaluation";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest) {
	const res: any = await getEvaluationConfig();
	return Response.json(res);
}

export async function POST(request: Request) {
	const formData = await request.json();
	const evaluationConfig: EvaluationConfigInput = {
		id: formData.id,
		provider: formData.provider,
		model: formData.model,
		vaultId: formData.vaultId,
		auto: false,
		recurringTime: "",
		meta: "",
	};

	const { err, data }: { err: any; data: any } = await setEvaluationConfig(
		evaluationConfig
	);

	if (err) {
		return Response.json(err, {
			status: 400,
		});
	}

	return Response.json(data);
}
