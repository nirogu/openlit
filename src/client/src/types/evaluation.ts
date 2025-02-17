import { EvaluationConfigs } from "@prisma/client";

export interface EvaluationConfig extends EvaluationConfigs {}

export interface EvaluationConfigInput
	extends Omit<EvaluationConfig, "id" | "databaseConfigId"> {
	id?: string;
	databaseConfigId?: string;
}

export interface EvaluationConfigResponse {
	config: string;
	configErr: string;
	data: Record<string, any>[];
	err: string;
}
