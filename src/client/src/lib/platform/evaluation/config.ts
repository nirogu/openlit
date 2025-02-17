import getMessage from "@/constants/messages";
import { getDBConfigByUser } from "@/lib/db-config";
import prisma from "@/lib/prisma";
import asaw from "@/utils/asaw";
import { throwIfError } from "@/utils/error";
import { getSecretById } from "../vault";
import { Secret } from "@/types/vault";
import { EvaluationConfig, EvaluationConfigInput } from "@/types/evaluation";
import { DatabaseConfig } from "@/types/database-config";

export async function getEvaluationConfig(
	dbConfig?: DatabaseConfig,
	excludeVaultValue: boolean = true
) {
	let updatedDBConfig: DatabaseConfig | undefined = dbConfig;
	if (!dbConfig?.id) {
		[, updatedDBConfig] = await asaw(getDBConfigByUser(true));
	}

	const [, config] = await asaw(
		prisma.evaluationConfigs.findFirst({
			where: {
				databaseConfigId: updatedDBConfig!.id,
			},
		})
	);

	const updatedConfig = config as EvaluationConfig;
	throwIfError(!updatedConfig?.id, getMessage().EVALUATION_CONFIG_NOT_FOUND);

	const { data } = await getSecretById(
		updatedConfig.vaultId,
		updatedDBConfig!.id,
		excludeVaultValue
	);

	const updatedSecretData = ((data as any[])?.[0] || {}) as Secret;

	throwIfError(
		!updatedSecretData?.id,
		getMessage().EVALUATION_VAULT_SECRET_NOT_FOUND
	);

	return {
		...updatedConfig,
		secret: updatedSecretData,
	};
}

export async function setEvaluationConfig(
	evaluationConfig: EvaluationConfigInput,
	dbConfig?: DatabaseConfig
) {
	let updatedDBConfig: DatabaseConfig | undefined = dbConfig;
	if (!dbConfig?.id) {
		[, updatedDBConfig] = await asaw(getDBConfigByUser(true));
	}

	throwIfError(!updatedDBConfig?.id, getMessage().DATABASE_CONFIG_NOT_FOUND);

	let err: any;
	let data: any;

	if (evaluationConfig.id) {
		[err, data] = await asaw(
			prisma.evaluationConfigs.update({
				data: evaluationConfig,
				where: {
					id: evaluationConfig.id!,
				},
			})
		);
	} else {
		[err, data] = await asaw(
			prisma.evaluationConfigs.create({
				data: {
					...evaluationConfig,
					databaseConfigId: updatedDBConfig!.id,
				},
			})
		);
	}

	throwIfError(err, getMessage().EVALUATION_CONFIG_SET_ERROR);

	return { err, data };
}
