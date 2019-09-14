
function login( data , type , url ) 
{  
    $.ajax
    ({
        url:  url,
        type: type,
        data: data,
        dataType : 'json'
    }).done( (data) =>
    { 
        if( data.status && data.token)
        {
            localStorage.setItem('token', data.token)            
            localStorage.setItem('idusuario', data.idusuario) 
            localStorage.setItem('idpunto', data.idpunto) 
            localStorage.setItem('userName', data.user_name) 

            $('body').addClass('login')            
            setTimeout(function(){ _reload() }, 1500)
        }
        else
        {
            $("p.msg").html( data.msg ) 
            $("#modal").modal('show')
        }
    })    
    .fail( ( error ) =>
    { 
        console.log("error" , error); 
    }) 
}
function addModal(id , options)
{
    //options.headerContent
    //options.bodyContent
    //options.backdrop
    //options.modalDialogClass
    //options.closeButton


    // <div class="alert alert-danger alert-dismissible" role="alert">
    //                                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    //                                 <span aria-hidden="true">×</span>
    //                                 </button>
    //                                 ${message}
    //                             </div>

    // <form action='../login.php' id="frmInit" autocomplete='off'>
    //                                 <div class="row">
    //                                     <div class="col-xl-4 form-group">
    //                                         <input type="text" class="form-control" name="userName" placeholder="Nombre de usuario">
    //                                     </div>
    //                                     <div class="col-xl-4 form-group">
    //                                         <input type="password" class="form-control" name="userPassword" placeholder="Contraseña">
    //                                     </div>
    //                                     <div class="col-xl-4 form-group">
    //                                         <button type="submit" id="btn" class="btn btn-primary btn-block">Ingresar</button>
    //                                         <input type="hidden" name="accion" value="login" />
    //                                     </div>
    //                                 </div>
    //                             </form>

    $("#"+id).remove()
    $("body").append(`<div class="modal fade modal-fill-in" id="${id}" data-backdrop="${options.backdrop}" data-keyboard="false"  role="dialog" tabindex="-1" aria-hidden="true" style="display: none;">
                        <div class="modal-dialog ${options.modalDialogClass}">
                        <div class="modal-content">
                            <div class="modal-header">
                              ${options.headerContent}
                            </div>
                            <div class="modal-body">
                              ${options.bodyContent} 
                            </div>
                        </div>
                        </div>
                    </div>`)
    $("#"+id).modal("show")
}
function _reload()
{
    location.reload()
} 
function numberFormatFE(value)
{
    return  numeral(parseFloat(value).toFixed(2)).format('$0,0.00') 
}
function numberFormat(value)
{
    return  numeral(parseFloat(value).toFixed(0)).format('0,0') 
}
function numberFormatFEClear(value)
{
    return  numeral(parseFloat(value).toFixed(2)).format('0,0') 
}
function isJson(str) 
{
    try 
    {
        JSON.parse(str);
    } 
    catch (e) 
    {
        return false;
    }
    return true;
}
(function ($) 
{
    $.fn.serializeFormJSON = function () 
    {
        var o = {}
        var a = this.serializeArray()
        $.each(a, function () 
        {
            if (o[this.name]) 
            {
                if (!o[this.name].push) 
                {
                    o[this.name] = [o[this.name]]
                }
                o[this.name].push(this.value || '')
            } 
            else 
            {
                o[this.name] = this.value || ''
            }
        })
        return o
    }
})(jQuery)



