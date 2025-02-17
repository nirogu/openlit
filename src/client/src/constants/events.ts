export const CLIENT_EVENTS = {
	// Page
	PAGE_VISITED: "PAGE_VISITED",
	// Auth
	LOGIN: "USER_LOGIN",
	REGISTER: "USER_REGISTER",
	// Database config
	DB_CONFIG_ADD_SUCCESS: "DB_CONFIG_ADD_SUCCESS",
	DB_CONFIG_UPDATE_SUCCESS: "DB_CONFIG_UPDATE_SUCCESS",
	DB_CONFIG_ADD_FAILURE: "DB_CONFIG_ADD_FAILURE",
	DB_CONFIG_UPDATE_FAILURE: "DB_CONFIG_UPDATE_FAILURE",
	DB_CONFIG_LIST: "DB_CONFIG_LIST",
	DB_CONFIG_ACTION_CHANGE: "DB_CONFIG_ACTION_CHANGE",
	// Profile
	PROFILE_UPDATE_SUCCESS: "PROFILE_UPDATE_SUCCESS",
	PROFILE_UPDATE_FAILURE: "PROFILE_UPDATE_FAILURE",
	// API KEY
	API_KEY_ADD_SUCCESS: "API_KEY_ADD_SUCCESS",
	API_KEY_ADD_FAILURE: "API_KEY_ADD_FAILURE",
	// Prompt
	PROMPT_ADD_SUCCESS: "PROMPT_ADD_SUCCESS",
	PROMPT_ADD_FAILURE: "PROMPT_ADD_FAILURE",
	PROMPT_VERSION_ADD_SUCCESS: "PROMPT_VERSION_ADD_SUCCESS",
	PROMPT_VERSION_ADD_FAILURE: "PROMPT_VERSION_ADD_FAILURE",
	// Vault
	VAULT_SECRET_ADD_SUCCESS: "VAULT_SECRET_ADD_SUCCESS",
	VAULT_SECRET_UPDATE_SUCCESS: "VAULT_SECRET_UPDATE_SUCCESS",
	VAULT_SECRET_ADD_FAILURE: "VAULT_SECRET_ADD_FAILURE",
	VAULT_SECRET_UPDATE_FAILURE: "VAULT_SECRET_UPDATE_FAILURE",
	// Openground
	OPENGROUND_EVALUATION_SUCCESS: "OPENGROUND_EVALUATION_SUCCESS",
	OPENGROUND_EVALUATION_FAILURE: "OPENGROUND_EVALUATION_FAILURE",
	// Custom
	REFRESH_RATE_CHANGE: "REFRESH_RATE_CHANGE",
	TIME_FILTER_CHANGE: "TIME_FILTER_CHANGE",
	TRACE_FILTER_APPLIED: "TRACE_FILTER_APPLIED",
	TRACE_FILTER_CLEARED: "TRACE_FILTER_CLEARED",

	// Evaluation config
	EVALUATION_CONFIG_CREATED: "EVALUATION_CONFIG_CREATED",
	EVALUATION_CONFIG_UPDATED: "EVALUATION_CONFIG_UPDATED",
	EVALUATION_CONFIG_CREATED_FAILURE: "EVALUATION_CONFIG_CREATED_FAILURE",
	EVALUATION_CONFIG_UPDATED_FAILURE: "EVALUATION_CONFIG_UPDATED_FAILURE",
};

export const SERVER_EVENTS = {
	// Prompt
	PROMPT_SDK_FETCH_SUCCESS: "PROMPT_SDK_FETCH_SUCCESS",
	PROMPT_SDK_FETCH_FAILURE: "PROMPT_SDK_FETCH_FAILURE",
	// Vault
	VAULT_SECRET_SDK_FETCH_SUCCESS: "VAULT_SECRET_SDK_FETCH_SUCCESS",
	VAULT_SECRET_SDK_FETCH_FAILURE: "VAULT_SECRET_SDK_FETCH_FAILURE",
};
