(function() {
  'use strict';

  angular
    .module('app')
    .component('accordion', {
      transclude: true,
      template:'<div class="accordion" ng-transclude></div>',
      controller: 'AccordionCtrl',
      controllerAs: '$ctrl'
    })
    .controller('AccordionCtrl', AccordionCtrl)
    .component('accordionPanel', {
      require: {
        'parent': '^accordion'
      },
      bindings: {
        heading: '@'
      },
      transclude: true,
      templateUrl: 'js/components/accordion/accordionPanelTmpl.html',
      controller: 'AccordionPanelCtrl',
      controllerAs: '$ctrl'
    })
    .controller('AccordionPanelCtrl', AccordionPanelCtrl)
    .controller('AccordionContentCtrl', AccordionContentCtrl);

    /* @ngInject */
    function AccordionCtrl($attrs) {
      var self = this;

      var panels = [];
      // here we take the panel and add to our list of panels
      // to preselect the first panel we call turnOn function on the first panel
      self.addPanel = function(panel) {
        panels.push(panel);
        if ($attrs.firstOpen === 'true' && panel === panels[0]) {
          return false;
        }
        return true;
      };
      // when a panel is selected we would want to open the content
      // here we take the panel find it in our array and turn if on if not selected
      // and off it.
      self.selectPanel = function(panel,isCollapsed) {
        for (var i in panels) {
          if (panel === panels[i]) {
            if (isCollapsed) {
              panels[i].turnOn();
            } else {
              panels[i].turnOff();
            }
          } else {
            panels[i].turnOff();
          }
        }
      };
    }
    
    /* @ngInject */
    function AccordionPanelCtrl($scope, $attrs) {
      
      var self = this;
      $scope.isCollapsed = true;
      
      // register the panel in init
      self.$onInit = function () {
        $scope.isCollapsed = self.parent.addPanel(self);
      };
      
      // Turns on the panel 
      self.turnOn = function () {
        $scope.isCollapsed = false;
      };
      
      // Turns off the panel 
      self.turnOff = function () {
        $scope.isCollapsed = true;
      };
      
      $scope.toggle = function() {
        // $scope.isCollapsed = !$scope.isCollapsed;
        self.parent.selectPanel(self,$scope.isCollapsed);
      };
    }

    /* @ngInject */
    function AccordionContentCtrl($scope, $element, $attrs) {
      var element = $element[0];
      
      $scope.$watch($attrs.collapse, function (collapse) {
        
        var newHeight = collapse ? 0 : getElementAutoHeight();

        element.style.height = newHeight + 'px';
      })
      
      function getElementAutoHeight() {
        var currentHeight = getElementCurrentHeight();
        
        element.style.height = 'auto';
        var autoHeight = getElementCurrentHeight();
        
        element.style.height = currentHeight;
        // Force the browser to recalc height after moving it back to normal
        getElementCurrentHeight(); 
        
        return autoHeight;
      }
      
      function getElementCurrentHeight() {
        return element.offsetHeight
      }
    }
})();