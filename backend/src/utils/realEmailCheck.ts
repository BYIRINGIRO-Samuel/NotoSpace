import deepEmailValidator from 'deep-email-validator';
interface IRealEmailCheckResult {
  valid: boolean;
  reason?: string;
  validators?: any;
}

export async function isRealEmail(email: string): Promise<IRealEmailCheckResult> {
  
  const result = await deepEmailValidator.validate({
    email,
    validateSMTP: true
  });
  
  return {  
    valid: result.valid, 
    reason: result.reason,
    validators: result.validators
  };
} 