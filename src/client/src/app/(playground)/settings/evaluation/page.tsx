"use client";

import FormBuilder, {
	FormBuilderEvent,
} from "@/components/common/form-builder";
import { CLIENT_EVENTS } from "@/constants/events";
import { getUserDetails, setUser } from "@/selectors/user";
import { useRootStore } from "@/store";
import useFetchWrapper from "@/utils/hooks/useFetchWrapper";
import { usePostHog } from "posthog-js/react";
import { toast } from "sonner";

const PROFILE_TOAST_ID = "profile-details";

function ModifyEvaluationSettings({
	evaluation,
}: {
	evaluation: any
}) {
	const posthog = usePostHog();
	const { fireRequest, isLoading } = useFetchWrapper();

	const modifyDetails: FormBuilderEvent = (event) => {
		event.preventDefault();
		const formElement = event.target as HTMLFormElement;

		const bodyObject = {
			currentPassword: (formElement.currentPassword as any)?.value,
			newPassword: (formElement.newPassword as any)?.value,
			name: (formElement.name as any)?.value,
		};

		if (
			bodyObject.newPassword !== (formElement.confirmNewPassword as any)?.value
		) {
			toast.loading("New password and Confirm new password does not match...", {
				id: PROFILE_TOAST_ID,
			});
			return;
		}

		toast.loading("Modifying profile details...", {
			id: PROFILE_TOAST_ID,
		});

		fireRequest({
			body: JSON.stringify(bodyObject),
			requestType: "POST",
			url: "/api/user/profile",
			responseDataKey: "data",
			successCb: () => {
				toast.success("Profile details updated!", {
					id: PROFILE_TOAST_ID,
				});
				formElement.reset();
				posthog?.capture(CLIENT_EVENTS.PROFILE_UPDATE_SUCCESS);
			},
			failureCb: (err?: string) => {
				toast.error(err || "Profile details updation failed!", {
					id: PROFILE_TOAST_ID,
				});
				posthog?.capture(CLIENT_EVENTS.PROFILE_UPDATE_FAILURE);
			},
		});
	};

	return (
		<FormBuilder
			fields={[
				{
					label: "LLM Provider",
					inputKey: `${evaluation?.id}-provider`,
					fieldType: "INPUT",
					fieldTypeProps: {
						type: "text",
						name: "email",
						placeholder: "e.g.",
						defaultValue: evaluation?.provider || ""
					},
				},
				{
					label: "Model",
					inputKey: `${evaluation?.id}-model`,
					fieldType: "INPUT",
					fieldTypeProps: {
						type: "text",
						name: "name",
						placeholder: "e.g. gpt-4",
						defaultValue: evaluation?.model || "",
					},
				},
				{
					label: "LLM API Key",
					fieldType: "INPUT",
					inputKey: `${evaluation?.id}-apiKey`,
					fieldTypeProps: {
						type: "password",
						name: "apiKey",
						placeholder: "*******",
					},
				},
			]}
			heading={`Update evaluation settings`}
			isLoading={isLoading}
			onSubmit={modifyDetails}
			submitButtonText={"Update"}
		/>
	);
}

export default function Evaluation() {
	const userDetails = useRootStore(getUserDetails);
	const setUserDetails = useRootStore(setUser);
	const { fireRequest: getUser } = useFetchWrapper();

	const fetchUser = () => {
		getUser({
			requestType: "GET",
			url: "/api/user/profile",
			responseDataKey: "data",
			successCb(res) {
				setUserDetails(res);
			},
			failureCb: (err?: string) => {
				toast.error(err || "Unauthorized access!", {
					id: PROFILE_TOAST_ID,
				});
			},
		});
	};

	return (
		<div className="flex flex-1 h-full w-full relative py-4  px-6 ">
			<ModifyEvaluationSettings evaluation={{}} />
		</div>
	);
}
