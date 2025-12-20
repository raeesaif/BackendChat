import { supabaseAuth } from "../src/config/supabaseAuth.js"
import { success, failure } from "../utils/response.js"

export const signUp = async (req, res) => {
    const { first_name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return failure(res, "Passwords do not match", 400)
    }

    const { data, error } = await supabaseAuth.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: first_name
            }
        }
    })

    if (error) {
        return failure(res, error.message, 400)
    }

    return success(res, "Please check your email to confirm your account", data)

}

export const login = async (req, res) => {
    const { email, password } = req.body

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return failure(res, error.message, 400)
    }

    if (!data.user?.email_confirmed_at) {
        return failure(res, "Please confirm your email before logging in", 401)
    }

    return success(res, "Login Successfully", data)

}

// logout 
export const logout = async (req, res) => {
    return success(res, "Logout Successfully")
}
// get user 
export const getUser = async (req, res) => {
    return res.json({
        status: "success",
        message: "User fetched successfully",
        data: req.user,
    });
};