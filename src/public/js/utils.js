const showToast = (result)=>{
    toastr.options = {
        "closeButton": true,
        "debug": true,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "showDuration": "300",
        "hideDuration": "1000000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    var  status = result.status;
    if(status == undefined){
        return toastr["error"](result);
    }
    if(status == "Success"){
        return toastr["success"](result.message);
    }else if( status =="Info"){
        return toastr["info"](result.message);
    }else if( status =="Warning"){
        return toastr["warning"](result.message);
    }else if( status =="Error"){
        return toastr["error"](result.message);
    }
    
}