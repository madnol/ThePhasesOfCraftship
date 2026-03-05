type ValidationErrorType = "InvalidLength" | "MissingUppercaseCharacter" | "NoDigitIncluded"

type ValidationError = {
    type: ValidationErrorType;
    message: string;
}

type ValidationOutput = {
    result: boolean;
    errors: ValidationError[]
}

export class PasswordValidator {

    public static validate(input: string): ValidationOutput {
        let errors: ValidationError[] = []

        const isBetweenFiveandFifty = input.length >= 5 && input.length <= 15

        if (!isBetweenFiveandFifty) {
            errors.push({
                type: 'InvalidLength',
                message: 'Must be between 5 and 15 characters long'
            })
        }

        return {
            result: errors.length === 0,
            errors
        }
    }
}