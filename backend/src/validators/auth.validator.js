
export const validateUserFields = (data) => {
  const errors = [];

 
  // if (!data.name) {
  //   errors.push("Name is required");
  // } else if (data.name.length < 3) {
  //   errors.push("Name must be at least 3 characters");
  // }

  if (!data.email) {
    errors.push("Email is required");
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("Email is invalid");
  }

  if (!data.password) {
    errors.push("Password is required");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
   if (!data.password) {
    errors.push("Password is required");}
  else if (data.role && !["admin", "employee"].includes(data.role)) {
    errors.push("Role must be either admin or employee");
  }

  return errors;
};
export const validateForgetPassword = (data)=>{
    const errors = [];
    if (!data.email){
        errors.push("Email is required");
    }else if(!/\S+@\S+\.\S+/.test(data.email)){
        errors.push("Email is invalid");
    }
//     if (!data.token) {
//     errors.push("Reset token is required");
//   }
    return errors;

};
export const validateResetPassword = (data) => {
  const errors = [];

  if (!data.password) {
    errors.push("Password is required");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (!data.confirmPassword) {
    errors.push("Confirm Password is required");
  } else if (data.password !== data.confirmPassword) {
    errors.push("Passwords do not match");
  }

  return errors;
};



