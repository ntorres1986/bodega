jQuery.ketchup

.validation('required', 'This field is required.', function(form, el, value) {
   if( typeof( el.attr('type') ) !== 'undefined' ){
    var type = el.attr('type').toLowerCase();
    
    if(type == 'checkbox' || type == 'radio') {
      return (el.attr('checked') == true);
    } else {
      return (value.length != 0);
    }
  }
})

.validation('minlength', 'La longitud mímina es de {arg1}.', function(form, el, value, min) {
  return (value.length >= Number(min));
})

.validation('maxlength', 'La longitud maxima es de {arg1}.', function(form, el, value, max) {
  return (value.length <= Number(max));
})

.validation('rangelength', 'This field must have a length between {arg1} and {arg2}.', function(form, el, value, min, max) {
  return (value.length >= Number(min) && value.length <= Number(max));
})

.validation('min', 'El valor no puede ser menor a {arg1}.', function(form, el, value, min) {
  return (this.isNumber(value) && Number(value) >= Number(min));
})

.validation('max', 'El valor no puede mayor a {arg1}.', function(form, el, value, max) {
  return (this.isNumber(value) && Number(value) <= Number(max));
})

.validation('range', 'Tiene que estar entre {arg1} and {arg2}.', function(form, el, value, min, max) {
  return (this.isNumber(value) && Number(value) >= Number(min) && Number(value) <=  Number(max));
})

.validation('number', 'Tiene que ser un numero.', function(form, el, value) {
  return this.isNumber(value);
})

.validation('digits', 'Tiene que ser un digito.', function(form, el, value) {
  return /^\d+$/.test(value);
})

.validation('email', 'Tiene que ser un correo valido.', function(form, el, value) {
  return this.isEmail(value);
})

.validation('url', 'Must be a valid URL.', function(form, el, value) {
  return this.isUrl(value);
})

.validation('username', 'Must be a valid username.', function(form, el, value) {
  return this.isUsername(value);
})

.validation('match', 'Must be {arg1}.', function(form, el, value, word) {
  return (el.val() == word);
})

.validation('contain', 'Must contain {arg1}', function(form, el, value, word) {
  return this.contains(value, word);
})

.validation('date', 'Must be a valid date.', function(form, el, value) {
  return this.isDate(value);
})

.validation('select', 'Seleccione una opción.', function(form, el, value) {
  return this.select(value);
})

.validation('minselect', 'Select at least {arg1} checkboxes.', function(form, el, value, min) {
  return (min <= this.inputsWithName(form, el).filter(':checked').length);
}, function(form, el) {
  this.bindBrothers(form, el);
})

.validation('maxselect', 'Select not more than {arg1} checkboxes.', function(form, el, value, max) {
  return (max >= this.inputsWithName(form, el).filter(':checked').length);
}, function(form, el) {
  this.bindBrothers(form, el);
})

.validation('rangeselect', 'Select between {arg1} and {arg2} checkboxes.', function(form, el, value, min, max) {
  var checked = this.inputsWithName(form, el).filter(':checked').length;
  
  return (min <= checked && max >= checked);
}, function(form, el) {
  this.bindBrothers(form, el);
});