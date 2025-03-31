
export const logout = (req,res)=>{
    try {
        //add logic in frontend to remove token 
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Logout failed" });
    }
}