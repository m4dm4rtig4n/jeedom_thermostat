
/* This file is part of Jeedom.
*
* Jeedom is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Jeedom is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
*/

$("#div_heat").sortable({axis: "y", cursor: "move", items: ".heat", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
$("#div_cool").sortable({axis: "y", cursor: "move", items: ".cool", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
$("#div_stop").sortable({axis: "y", cursor: "move", items: ".stop", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
$("#div_orderChange").sortable({axis: "y", cursor: "move", items: ".orderChange", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
$("#div_failureActuator").sortable({axis: "y", cursor: "move", items: ".failureActuator", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});

$(".eqLogic").off('click','.listCmdInfo').on('click','.listCmdInfo', function () {
  var el = $(this).closest('.form-group').find('.eqLogicAttr');
  jeedom.cmd.getSelectModal({cmd: {type: 'info'}}, function (result) {
    if (el.attr('data-concat') == 1) {
      el.atCaret('insert', result.human);
    } else {
      el.value(result.human);
    }
  });
});

$('body').off('click','.rename').on('click','.rename', function () {
  var el = $(this);
  bootbox.prompt("{{Nouveau nom ?}}", function (result) {
    if (result !== null) {
      el.text(result);
      el.closest('.mode').find('.modeAttr[data-l1key=name]').value(result);
    }
  });
});

$("body").off('click','.listCmdAction').on('click','.listCmdAction', function () {
  var type = $(this).attr('data-type');
  var el = $(this).closest('.' + type).find('.expressionAttr[data-l1key=cmd]');
  jeedom.cmd.getSelectModal({cmd: {type: 'action'}}, function (result) {
    el.value(result.human);
    jeedom.cmd.displayActionOption(el.value(), '', function (html) {
      el.closest('.' + type).find('.actionOptions').html(html);
    });
    
  });
});

$('#bt_cronGenerator').off('click').on('click',function(){
  jeedom.getCronSelectModal({},function (result) {
    $('.eqLogicAttr[data-l1key=configuration][data-l2key=repeat_commande_cron]').value(result.value);
  });
});

$('#bt_razLearning').off('click').on('click',function(){
  $('.eqLogicAttr[data-l1key=configuration][data-l2key=coeff_indoor_heat_autolearn]').value(1);
  $('.eqLogicAttr[data-l1key=configuration][data-l2key=coeff_indoor_cool_autolearn]').value(1);
  $('.eqLogicAttr[data-l1key=configuration][data-l2key=coeff_outdoor_heat_autolearn]').value(1);
  $('.eqLogicAttr[data-l1key=configuration][data-l2key=coeff_outdoor_cool_autolearn]').value(1);
  $('.eqLogicAttr[data-l1key=configuration][data-l2key=coeff_indoor_heat]').value(10);
  $('.eqLogicAttr[data-l1key=configuration][data-l2key=coeff_indoor_cool]').value(10);
  $('.eqLogicAttr[data-l1key=configuration][data-l2key=coeff_outdoor_heat]').value(2);
  $('.eqLogicAttr[data-l1key=configuration][data-l2key=coeff_outdoor_cool]').value(2);
});

$('.addAction').off('click').on('click', function () {
  addAction({}, $(this).attr('data-type'));
});

$('.addWindow').off('click').on('click', function () {
  addWindow({});
});

$('.addFailure').off('click').on('click', function () {
  addFailure({});
});

$('.addFailureActuator').off('click').on('click', function () {
  addFailureActuator({});
});

$('.eqLogicAttr[data-l1key=configuration][data-l2key=engine]').off('change').on('change', function () {
  $('.engine').hide();
  $('.' + $(this).value()).show();
});

$("body").off('click', '.listCmdInfoWindow').on('click', '.listCmdInfoWindow',function () {
  var el = $(this).closest('.form-group').find('.expressionAttr[data-l1key=cmd]');
  jeedom.cmd.getSelectModal({cmd: {type: 'info', subtype: 'binary'}}, function (result) {
    el.value(result.human);
  });
});

$('.addMode').off('click').on('click', function () {
  bootbox.prompt("{{Nom du mode ?}}", function (result) {
    if (result !== null) {
      addMode({name: result});
    }
  });
});

$("body").off('click','.addModeAction').on('click','.addModeAction',function () {
  addModeAction({}, $(this).closest('.mode').find('.div_modeAction'));
});

$("body").off('click','.removeMode').on('click','.removeMode',function () {
  var el = $(this);
  bootbox.confirm('{{Etes-vous sûr de vouloir supprimer ce mode}} ?', function (result) {
    if (result !== null) {
      el.closest('.mode').remove();
    }
  });
});

$('body').off('focusout','.cmdAction.expressionAttr[data-l1key=cmd]').on('focusout','.cmdAction.expressionAttr[data-l1key=cmd]',function (event) {
  var type = $(this).attr('data-type');
  var expression = $(this).closest('.' + type).getValues('.expressionAttr');
  var el = $(this);
  jeedom.cmd.displayActionOption($(this).value(), init(expression[0].options), function (html) {
    el.closest('.' + type).find('.actionOptions').html(html);
  });
  
});

$("body").off('click','.bt_removeAction').on('click','.bt_removeAction',function () {
  var type = $(this).attr('data-type');
  $(this).closest('.' + type).remove();
});

$('#bt_configureMode').off('click').on('click', function () {
  $('#md_modal').dialog({title: "{{Configuration des modes}}"});
  $('#md_modal').load('index.php?v=d&plugin=thermostat&modal=configure.mode').dialog('open');
});


function saveEqLogic(_eqLogic) {
  if (!isset(_eqLogic.configuration)) {
    _eqLogic.configuration = {};
  }
  _eqLogic.configuration.heating = $('#div_heat .heat').getValues('.expressionAttr');
  _eqLogic.configuration.cooling = $('#div_cool .cool').getValues('.expressionAttr');
  _eqLogic.configuration.stoping = $('#div_stop .stop').getValues('.expressionAttr');
  _eqLogic.configuration.window = $('#div_window .window').getValues('.expressionAttr');
  _eqLogic.configuration.failure = $('#div_failure .failure').getValues('.expressionAttr');
  _eqLogic.configuration.failureActuator = $('#div_failureActuator .failureActuator').getValues('.expressionAttr');
  _eqLogic.configuration.orderChange = $('#div_orderChange .orderChange').getValues('.expressionAttr');
  _eqLogic.configuration.existingMode = [];
  $('#div_modes .mode').each(function () {
    var existingMode = $(this).getValues('.modeAttr');
    existingMode = existingMode[0];
    existingMode.actions = $(this).find('.modeAction').getValues('.expressionAttr');
    _eqLogic.configuration.existingMode.push(existingMode);
  });
  return _eqLogic;
}



function printEqLogic(_eqLogic) {
  $('#div_heat').empty();
  $('#div_cool').empty();
  $('#div_stop').empty();
  $('#div_modes').empty();
  $('#div_window').empty();
  $('#div_orderChange').empty();
  $('#div_failure').empty();
  $('#div_failureActuator').empty();
  printScheduling(_eqLogic);
  if (isset(_eqLogic.configuration)) {
    if (isset(_eqLogic.configuration.heating)) {
      for (var i in _eqLogic.configuration.heating) {
        addAction(_eqLogic.configuration.heating[i], 'heat');
      }
    }
    if (isset(_eqLogic.configuration.cooling)) {
      for (var i in _eqLogic.configuration.cooling) {
        addAction(_eqLogic.configuration.cooling[i], 'cool');
      }
    }
    if (isset(_eqLogic.configuration.stoping)) {
      for (var i in _eqLogic.configuration.stoping) {
        addAction(_eqLogic.configuration.stoping[i], 'stop');
      }
    }
    if (isset(_eqLogic.configuration.orderChange)) {
      for (var i in _eqLogic.configuration.orderChange) {
        addAction(_eqLogic.configuration.orderChange[i], 'orderChange');
      }
    }
    
    if (isset(_eqLogic.configuration.window)) {
      for (var i in _eqLogic.configuration.window) {
        addWindow(_eqLogic.configuration.window[i]);
      }
    }
    if (isset(_eqLogic.configuration.existingMode)) {
      for (var i in _eqLogic.configuration.existingMode) {
        addMode(_eqLogic.configuration.existingMode[i]);
      }
    }
    if (isset(_eqLogic.configuration.failure)) {
      for (var i in _eqLogic.configuration.failure) {
        addFailure(_eqLogic.configuration.failure[i]);
      }
    }
    if (isset(_eqLogic.configuration.failureActuator)) {
      for (var i in _eqLogic.configuration.failureActuator) {
        addFailureActuator(_eqLogic.configuration.failureActuator[i]);
      }
    }
  }
}

function printScheduling(_eqLogic){
  $.ajax({
    type: 'POST',
    url: 'plugins/thermostat/core/ajax/thermostat.ajax.php',
    data: {
      action: 'getLinkCalendar',
      id: _eqLogic.id,
    },
    dataType: 'json',
    error: function (request, status, error) {
      handleAjaxError(request, status, error);
    },
    success: function (data) {
      if (data.state != 'ok') {
        $('#div_alert').showAlert({message: data.result, level: 'danger'});
        return;
      }
      $('#div_schedule').empty();
      if(data.result.length == 0){
        $('#div_schedule').append("<center><span style='color:#767676;font-size:1.2em;font-weight: bold;'>{{Vous n'avez encore aucune programmation. Veuillez cliquer <a href='index.php?v=d&m=calendar&p=calendar'>ici</a> pour programmer votre thermostat à l'aide du plugin agenda}}</span></center>");
      }else{
        var html = '<legend>{{Liste des programmations du plugin Agenda liées au Thermostat}}</legend>';
        for (var i in data.result) {
          var color = init(data.result[i].cmd_param.color, '#2980b9');
          if(data.result[i].cmd_param.transparent == 1){
            color = 'transparent';
          }
          html += '<span class="label label-info cursor" style="font-size:1.2em;background-color : ' + color + ';color : ' + init(data.result[i].cmd_param.text_color, 'black') + '">';
          html += '<a href="index.php?v=d&m=calendar&p=calendar&id='+data.result[i].eqLogic_id+'&event_id='+data.result[i].id+'" style="color : ' + init(data.result[i].cmd_param.text_color, 'black') + '">'
          
          if (data.result[i].cmd_param.eventName != '') {
            html += data.result[i].cmd_param.icon + ' ' + data.result[i].cmd_param.eventName;
          } else {
            html += data.result[i].cmd_param.icon + ' ' + data.result[i].cmd_param.name;
          }
          html += '</a></span><br\><br\>';
        }
        $('#div_schedule').empty().append(html);
      }
    }
  });
  
}

function addMode(_mode) {
  if (init(_mode) == '') {
    return;
  }
  var div = '<form class="form-horizontal mode">';
  div += '<fieldset>';
  div += '<legend>';
  div += '<span class="rename cursor">' + _mode.name + '</span>';
  div += ' <span style="font-size:0.8em;margin-left:20px;">{{Visible}}</span> <input type="checkbox"  class="modeAttr" data-l1key="isVisible" checked /> ';
  div += ' <a class="btn btn-danger btn-xs removeMode pull-right"><i class="fas fa-minus-circle"></i> Supprimer mode</a> ';
  div += ' <a class="btn btn-default btn-xs addModeAction pull-right"><i class="fas fa-plus-circle"></i> Ajouter action</a> ';
  div += ' </legend>';
  div += '<input class="modeAttr" data-l1key="name"  style="display : none;" value="' + _mode.name + '"/>';
  div += ' <div class="div_modeAction">';
  div += ' </div>';
  div += '</fieldset> ';
  div += '</form>';
  $('#div_modes').append(div);
  $('#div_modes .mode').last().setValues(_mode, '.modeAttr');
  if (isset(_mode.actions)) {
    for (var i in _mode.actions) {
      if (init(_mode.actions[i].cmd) != '') {
        addModeAction(_mode.actions[i], $('#div_modes .mode:last .div_modeAction'));
      }
    }
  }
  $("#div_modes .mode:last .div_modeAction").sortable({axis: "y", cursor: "move", items: ".modeAction", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true});
}

function addModeAction(_modeAction, _el) {
  var div = '<div class="modeAction">';
  div += '<div class="form-group ">';
  div += '<label class="col-sm-1 control-label">Action</label>';
  div += '<div class="col-sm-3">';
  div += '<div class="input-group">';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default bt_removeAction roundedLeft" data-type="modeAction"><i class="fas fa-minus-circle"></i></a>';
  div += '</span>';
  div += '<input class="expressionAttr form-control cmdAction" data-l1key="cmd" data-type="modeAction" />';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default listCmdAction roundedRight" data-type="modeAction"><i class="fas fa-list-alt"></i></a>';
  div += '</span>';
  div += '</div>';
  div += '</div>';
  div += '<div class="col-sm-7 actionOptions">';
  div += jeedom.cmd.displayActionOption(init(_modeAction.cmd, ''), _modeAction.options);
  div += '</div>';
  div += '</div>';
  _el.append(div);
  _el.find('.modeAction').last().setValues(_modeAction, '.expressionAttr');
}


function addAction(_action, _type) {
  var div = '<div class="' + _type + '">';
  div += '<div class="form-group ">';
  div += '<label class="col-sm-1 control-label">Action</label>';
  div += '<div class="col-sm-4">';
  div += '<div class="input-group">';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default bt_removeAction roundedLeft" data-type="' + _type + '"><i class="fas fa-minus-circle"></i></a>';
  div += '</span>';
  div += '<input class="expressionAttr form-control cmdAction" data-l1key="cmd" data-type="' + _type + '" />';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default listCmdAction roundedRight" data-type="' + _type + '"><i class="fas fa-list-alt"></i></a>';
  div += '</span>';
  div += '</div>';
  div += '</div>';
  div += '<div class="col-sm-7 actionOptions">';
  div += jeedom.cmd.displayActionOption(init(_action.cmd, ''), _action.options);
  div += '</div>';
  div += '</div>';
  $('#div_' + _type).append(div);
  $('#div_' + _type + ' .' + _type + '').last().setValues(_action, '.expressionAttr');
}


function addWindow(_info) {
  var div = '<div class="window">';
  div += '<div class="form-group ">';
  div += '<label class="col-sm-1 control-label">Ouverture</label>';
  div += '<div class="col-sm-4">';
  div += '<div class="input-group">';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default bt_removeAction roundedLeft" data-type="window"><i class="fas fa-minus-circle"></i></a>';
  div += '</span>';
  div += '<input class="expressionAttr form-control cmdInfo" data-l1key="cmd" />';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default listCmdInfoWindow roundedRight"><i class="fas fa-list-alt"></i></a>';
  div += '</span>';
  div += '</div>';
  div += '</div>';
  div += '<label class="col-sm-2 control-label">{{Eteindre si ouvert plus de (min)}}</label>';
  div += '<div class="col-sm-1">';
  div += '<input class="expressionAttr form-control cmdInfo" data-l1key="stopTime" />';
  div += '</div>';
  div += '<label class="col-sm-2 control-label">{{Rallumer si fermé depuis (min)}}</label>';
  div += '<div class="col-sm-1">';
  div += '<input class="expressionAttr form-control cmdInfo" data-l1key="restartTime"/>';
  div += '</div>';
  div += '<div class="col-sm-1">';
  div += '<label class="checkbox-inline"><input type="checkbox" class="expressionAttr cmdInfo" data-l1key="invert"/>{{Inverser}}</label></span>';
  div += '</div>';
  div += '</div>';
  $('#div_window').append(div);
  $('#div_window .window').last().setValues(_info, '.expressionAttr');
}

function addFailure(_info) {
  var div = '<div class="failure">';
  div += '<div class="form-group ">';
  div += '<label class="col-sm-1 control-label">Action</label>';
  div += '<div class="col-sm-4">';
  div += '<div class="input-group">';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default bt_removeAction roundedLeft" data-type="failure"><i class="fas fa-minus-circle"></i></a>';
  div += '</span>';
  div += '<input class="expressionAttr form-control cmdAction" data-l1key="cmd" data-type="failure" />';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default listCmdAction roundedRight" data-type="failure"><i class="fas fa-list-alt"></i></a>';
  div += '</span>';
  div += '</div>';
  div += '</div>';
  div += '<div class="col-sm-7 actionOptions">';
  div += jeedom.cmd.displayActionOption(init(_info.cmd, ''), _info.options);
  div += '</div>';
  div += '</div>';
  $('#div_failure').append(div);
  $('#div_failure .failure').last().setValues(_info, '.expressionAttr');
}

function addFailureActuator(_info) {
  var div = '<div class="failureActuator">';
  div += '<div class="form-group ">';
  div += '<label class="col-sm-1 control-label">Action</label>';
  div += '<div class="col-sm-4">';
  div += '<div class="input-group">';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default bt_removeAction roundedLeft" data-type="failureActuator"><i class="fas fa-minus-circle"></i></a>';
  div += '</span>';
  div += '<input class="expressionAttr form-control cmdAction" data-l1key="cmd" data-type="failureActuator" />';
  div += '<span class="input-group-btn">';
  div += '<a class="btn btn-default listCmdAction roundedRight" data-type="failureActuator"><i class="fas fa-list-alt"></i></a>';
  div += '</span>';
  div += '</div>';
  div += '</div>';
  div += '<div class="col-sm-7 actionOptions">';
  div += jeedom.cmd.displayActionOption(init(_info.cmd, ''), _info.options);
  div += '</div>';
  div += '</div>';
  $('#div_failureActuator').append(div);
  $('#div_failureActuator .failureActuator').last().setValues(_info, '.expressionAttr');
}
