export type LighthouseSeoRun = Readonly<{
	performance: number;
	accessibility: number;
	seo: number;
	bestPractices: number;
	lcpMs: number;
	cls: number;
	tbtMs: number;
}>;

export type FieldVitals = Readonly<{
	lcpMs: number;
	inpMs: number;
	cls: number;
}>;

type FieldData = Readonly<{
	windowDays: 28;
	mobile: FieldVitals;
	desktop: FieldVitals;
}>;

type MeasurementInput = Readonly<{
	lighthouseRuns: readonly LighthouseSeoRun[];
	fieldData?: FieldData;
}>;

const labThresholds = Object.freeze({
	performance: 0.9,
	accessibility: 1,
	seo: 0.9,
	bestPractices: 0.95,
	lcpMs: 2_500,
	cls: 0.1,
	tbtMs: 350,
});
const fieldThresholds = Object.freeze({ lcpMs: 2_500, inpMs: 200, cls: 0.1 });

export function evaluateSeoMeasurement(input: MeasurementInput) {
	if (input.lighthouseRuns.length !== 3) {
		throw new Error("Lighthouse evidence must contain exactly three runs");
	}
	for (const run of input.lighthouseRuns) validateLighthouseRun(run);

	const median = Object.freeze({
		performance: medianOf(input.lighthouseRuns.map((run) => run.performance)),
		accessibility: medianOf(input.lighthouseRuns.map((run) => run.accessibility)),
		seo: medianOf(input.lighthouseRuns.map((run) => run.seo)),
		bestPractices: medianOf(input.lighthouseRuns.map((run) => run.bestPractices)),
		lcpMs: medianOf(input.lighthouseRuns.map((run) => run.lcpMs)),
		cls: medianOf(input.lighthouseRuns.map((run) => run.cls)),
		tbtMs: medianOf(input.lighthouseRuns.map((run) => run.tbtMs)),
	});
	const labFailures = failures(median, labThresholds, new Set(["performance", "accessibility", "seo", "bestPractices"]));
	const field = input.fieldData ? reportedField(input.fieldData) : Object.freeze({ status: "no-data" as const });

	return deepFreeze({
		lab: {
			kind: "lab" as const,
			runCount: 3 as const,
			median,
			thresholds: labThresholds,
			pass: labFailures.length === 0,
			failures: labFailures,
			responsiveness: {
				metric: "TBT" as const,
				role: "lab-proxy" as const,
				valueMs: median.tbtMs,
				thresholdMs: labThresholds.tbtMs,
			},
		},
		field,
	});
}

function reportedField(fieldData: FieldData) {
	if (!fieldData.mobile || !fieldData.desktop) {
		throw new Error("Field evidence must include both mobile and desktop p75 metrics");
	}
	if (fieldData.windowDays !== 28) throw new Error("Field evidence must use the accepted 28-day window");
	validateFieldVitals(fieldData.mobile, "mobile");
	validateFieldVitals(fieldData.desktop, "desktop");
	return {
		status: "reported" as const,
		windowDays: fieldData.windowDays,
		percentile: 75 as const,
		thresholds: fieldThresholds,
		devices: {
			mobile: fieldResult(fieldData.mobile),
			desktop: fieldResult(fieldData.desktop),
		},
	};
}

function fieldResult(vitals: FieldVitals) {
	const metricFailures = failures(vitals, fieldThresholds);
	return { ...vitals, pass: metricFailures.length === 0, failures: metricFailures };
}

function failures<T extends Readonly<Record<string, number>>>(
	values: T,
	thresholds: Readonly<Record<keyof T, number>>,
	minimumMetrics: ReadonlySet<string> = new Set(),
) {
	return Object.freeze((Object.keys(thresholds) as (keyof T)[])
		.filter((metric) => minimumMetrics.has(String(metric))
			? values[metric] < thresholds[metric]
			: values[metric] > thresholds[metric])
		.map(String));
}

function validateLighthouseRun(run: LighthouseSeoRun) {
	for (const metric of ["performance", "accessibility", "seo", "bestPractices"] as const) {
		if (!Number.isFinite(run[metric]) || run[metric] < 0 || run[metric] > 1) {
			throw new Error(`Lighthouse ${metric} must be a finite score from 0 to 1`);
		}
	}
	for (const metric of ["lcpMs", "cls", "tbtMs"] as const) validateNonnegative(run[metric], `Lighthouse ${metric}`);
}

function validateFieldVitals(vitals: FieldVitals, device: string) {
	for (const metric of ["lcpMs", "inpMs", "cls"] as const) validateNonnegative(vitals[metric], `${device} ${metric}`);
}

function validateNonnegative(value: number, label: string) {
	if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must be a finite nonnegative number`);
}

function medianOf(values: readonly number[]) {
	return [...values].sort((left, right) => left - right)[Math.floor(values.length / 2)];
}

function deepFreeze<T>(value: T): T {
	if (value && typeof value === "object" && !Object.isFrozen(value)) {
		Object.freeze(value);
		for (const child of Object.values(value)) deepFreeze(child);
	}
	return value;
}
