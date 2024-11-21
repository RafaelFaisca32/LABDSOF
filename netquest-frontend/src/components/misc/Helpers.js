import {toast} from "react-toastify";

export const handleLogError = (error) => {
  if (error.response) {
    console.log(error.response.data)
  } else if (error.request) {
    console.log(error.request)
  } else {
    console.log(error.message)
  }
}

export const successNotification = (message)=>{
  toast.success(message, {
    position: "top-right",
    autoClose: 3000, // Closes after 3 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

export const errorNotification = (message)=>{
  toast.error(message, {
    position: "top-right",
    autoClose: 5000, // Closes after 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}