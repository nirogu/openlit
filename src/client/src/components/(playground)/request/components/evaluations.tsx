import { Button } from "@/components/ui/button";
import getMessage from "@/constants/messages";
import { EvaluationConfigResponse } from "@/types/evaluation";
import { TransformedTraceRow } from "@/types/trace";
import useFetchWrapper from "@/utils/hooks/useFetchWrapper";
import { objectEntries } from "@/utils/object";
import Link from "next/link";
import { useEffect } from "react";
import ContentDataItem from "./content-data";
import { toast } from "sonner";

export default function Evaluations({ trace }: { trace: TransformedTraceRow }) {
	const { data, isLoading, fireRequest, isFetched } =
		useFetchWrapper<EvaluationConfigResponse>();
	const evaluationData = (data as any)?.data as any[];

	const { fireRequest: runEvaluationRequest } = useFetchWrapper();

	const runEvaluation = () => {
		runEvaluationRequest({
			url: `/api/evaluation/${trace.spanId}`,
			requestType: "POST",
			responseDataKey: "data",
			successCb: () => {
				getEvaluations();
			},
			failureCb: () => {
				toast.error(getMessage().EVALUATION_RUN_FAILURE);
			},
		});
	};

	const getEvaluations = () => {
		fireRequest({
			url: `/api/evaluation/${trace.spanId}`,
			requestType: "GET",
		});
	};

	useEffect(() => {
		if (!evaluationData?.length) {
			getEvaluations();
		}
	}, [trace.spanId]);

	return (
		<div className="flex flex-col gap-2 px-4">
			{isLoading || !isFetched ? (
				<div className="text-sm text-stone-500 dark:text-stone-300">
					{getMessage().EVALUATION_DATA_LOADING}
				</div>
			) : data?.configErr ? (
				<>
					<div className="text-sm text-stone-500 dark:text-stone-300">
						{getMessage().EVALUATION_CONFIG_NOT_SET}
					</div>
					<Button variant="destructive" className="w-fit">
						<Link href="/settings/evaluation">
							{getMessage().EVALUATION_CONFIG_SET}
						</Link>
					</Button>
				</>
			) : data?.config ? (
				<>
					<div className="text-sm text-stone-500 dark:text-stone-300">
						{getMessage().EVALUATION_NOT_RUN_YET}
					</div>
					<Button
						variant="default"
						className="w-fit bg-primary"
						onClick={runEvaluation}
					>
						{getMessage().EVALUATION_RUN}
					</Button>
				</>
			) : data?.err ? (
				<div className="text-sm text-stone-500 dark:text-stone-300">
					{data?.err}
				</div>
			) : (
				(data?.data || []).map((datumValue, index) => (
					<section key={`evaluation-${index}`}>
						{index !== 0 ? (
							<div className="py-1 px-2 dark:bg-stone-800"></div>
						) : null}
						{objectEntries(datumValue).map(([key, value]) => (
							<ContentDataItem
								key={key.toString()}
								dataKey={key.toString()}
								dataValue={value}
							/>
						))}
					</section>
				))
			)}
		</div>
	);
}
