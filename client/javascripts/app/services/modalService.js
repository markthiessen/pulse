PulseApp.factory('$modalService', ['$rootScope', '$document',
	function($rootScope, $document){
		
		var modalTemplate = '<div class="modal fade" id="detail-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
  +'<div class="modal-dialog">'
  + '<div class="modal-content">'
  +    '<div class="modal-header">'
  +      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
  +      '<h4 class="modal-title" id="myModalLabel">Image</h4>'
  +    '</div>'
  +    '<div class="modal-body">'
  +    ''
  +    '</div>'
  +    '<div class="modal-footer">'
  +      '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'
  +    '</div>'
  +  '</div><!-- /.modal-content -->'
  +'</div><!-- /.modal-dialog -->'
  +'</div><!-- /.modal -->';

  	var modal = angular.element(modalTemplate);
  	angular.element(document.body);
  	modal.on('hidden.bs.modal', function(){
  		angular.element('.modal-backdrop').hide();
  	});
		return {
		    showInModal: function (elm, url, isHtml5Vid) {
		        if (isHtml5Vid) {
		            var link = angular.element('<a href="https://' + url.substring(url.indexOf('.')+1) + '" target="_blank">' +
		                '<video autoplay="" loop="" muted="" preload="" style="max-width: 560px;">' +
		                '<source src="' + url + '.webm" type="video/webm">' +
		                '<source src="' + url + '.mp4" type="video/mp4"></video></a>');
		        } else {
		            var link = angular.element('<a>').attr({ 'href': url, 'target': '_blank' }).css({ 'cursor': 'pointer' });
		            link.append(angular.element(elm).clone());
		        }

				modal.find('.modal-body').html(link);
				modal.modal({backdrop:true});
				//angular.element('elm').modal({keyboard:false});
			}
		};
	}]);