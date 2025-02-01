import CreateEvaluationMigration from "./create-evaluation-migration";
import CreatePromptMigration from "./create-prompt-migration";
import CreateVaultMigration from "./create-vault-migration";

export default async function migrations(databaseConfigId?: string) {
	await CreatePromptMigration(databaseConfigId);
	await CreateVaultMigration(databaseConfigId);
	await CreateEvaluationMigration(databaseConfigId);
}
