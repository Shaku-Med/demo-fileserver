interface VerifyFormProps {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    agreeToTerms: boolean;
}
export default async function VerifyForm(form: VerifyFormProps): Promise<boolean | null | string>{
    try {
        if(!form.agreeToTerms) return "You must agree to the terms and conditions";

        if(!form.email || !form.password || !form.firstName || !form.lastName || !form.agreeToTerms) return "All fields are required";
        if(form.password.length < 8) return "Password must be at least 8 characters long";
        if(form.firstName.trim().length < 2) return "First name must be at least 2 characters long";
        if(form.lastName.trim().length < 2) return "Last name must be at least 2 characters long";
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(form.email)) return "Please enter a valid email address";
        if(form.password.includes(form.email)) return "Password cannot contain your email address";
        if(form.password.length > 30) return "Password must be at most 30 characters";

        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
        if(!passwordRegex.test(form.password)) return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        
        return true;
    }
    catch (e) {
        console.error(e)
        return null
    }
}