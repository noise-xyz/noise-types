import BigNumber from "bignumber.js";

// Configure BigNumber
BigNumber.config({
    DECIMAL_PLACES: 18, // Maximum decimal places for internal calculations
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    EXPONENTIAL_AT: [-50, 50],
});

export const BN_ZERO = new BigNumber(0);
export const BN_ONE = new BigNumber(1);

// Maximum values for Postgres numeric(38,2)
const MAX_INTEGER_DIGITS = 36; // 38 total - 2 decimal places
const MAX_VALUE = new BigNumber("9".repeat(MAX_INTEGER_DIGITS) + ".99");
const MIN_VALUE = MAX_VALUE.negated();

/**
 * Converts a number or string to a BigNumber with proper precision
 */
export function toBN(
    value: BigNumber | string | number | null | undefined,
): BigNumber {
    if (value === null || value === undefined) {
        return BN_ZERO;
    }
    if (value instanceof BigNumber) {
        return value;
    }
    return new BigNumber(value);
}

/**
 * Clamps a value between the maximum and minimum allowed values
 */
function clampValue(value: BigNumber): BigNumber {
    if (value.isGreaterThan(MAX_VALUE)) {
        console.warn(
            "Value exceeded maximum PostgreSQL numeric limit, clamping to max",
        );
        return MAX_VALUE;
    }
    if (value.isLessThan(MIN_VALUE)) {
        console.warn(
            "Value exceeded minimum PostgreSQL numeric limit, clamping to min",
        );
        return MIN_VALUE;
    }
    return value;
}

/**
 * Converts a BigNumber to a Postgres numeric string with proper precision
 */
export function toPostgresNumeric(value: BigNumber | number | string): string {
    const bn = toBN(value);
    const clampedValue = clampValue(bn);
    return clampedValue.toFixed(2); // Always use 2 decimal places for PostgreSQL
}

/**
 * Converts a Postgres numeric string to a BigNumber
 */
export function fromPostgresNumeric(value: string | null): BigNumber {
    if (!value) return BN_ZERO;
    return new BigNumber(value);
}

/**
 * Safely divides two BigNumbers, returning 0 if denominator is 0
 */
export function safeDivide(
    numerator: BigNumber,
    denominator: BigNumber,
): BigNumber {
    if (denominator.isZero()) {
        return BN_ZERO;
    }
    return clampValue(numerator.dividedBy(denominator));
}

/**
 * Formats a BigNumber to a fixed number of decimal places for display
 */
export function formatForDisplay(
    value: BigNumber,
    decimals: number = 2,
): string {
    return value.toFixed(decimals);
}

/**
 * Converts a BigNumber to a number for cases where precision loss is acceptable
 * Useful for UI display or non-critical calculations
 */
export function toNumber(value: BigNumber): number {
    return value.toNumber();
}

/**
 * Checks if a BigNumber is positive
 */
export function isPositive(value: BigNumber): boolean {
    return value.isGreaterThan(0);
}

/**
 * Gets the absolute value of a BigNumber
 */
export function abs(value: BigNumber): BigNumber {
    return value.absoluteValue();
}

// Additional math operations that ensure values stay within PostgreSQL limits
export function multiply(a: BigNumber, b: BigNumber): BigNumber {
    return clampValue(a.multipliedBy(b));
}

export function add(a: BigNumber, b: BigNumber): BigNumber {
    return clampValue(a.plus(b));
}

export function subtract(a: BigNumber, b: BigNumber): BigNumber {
    return clampValue(a.minus(b));
}
