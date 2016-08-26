// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'taskmanager' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('taskmanager', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// services
.factory('Categories', function(){
	return {
		// get all categories
		all: function(){
			var categoryString = window.localStorage['categories'];
			// convert from string to object
			if(categoryString){
				return angular.fromJson(categoryString);
			}
			return [];
		},
		// save category
		save: function(categories){
			// interact local storage
			window.localStorage['categories'] = angular.toJson(categories);
		},
		// add new category
		newCategory: function(categoryTitle){
			// Add Category
			return {
				title: categoryTitle,
				tasks: []
			};
		},
		getLastActiveIndex: function(){
			return parseInt(window.localStorage['lastActiveCategory']) || 0;
		},
		setLastActiveIndex: function(index){
			window.localStorage['lastActiveCategory'] = index;
		}
	}
})

// controller
.controller('taskCtrl', function($scope,$ionicModal,Categories,$ionicSideMenuDelegate,$timeout){
	//console.log('taskCtrl');
	var createCategory = function(categoryTitle){
		var newCategory = Categories.newCategory(categoryTitle);
		$scope.categories.push(newCategory);
		Categories.save($scope.categories);
		$scope.selectCategory(newCategory, $scope.categories.length-1);
	}
	
	// init categories
	$scope.categories = Categories.all();
	
	// get last category
	$scope.activeCategory = $scope.categories[Categories.getLastActiveIndex()];
	
	// add new category
	$scope.newCategory = function(){
		console.log('newCategory');
		var categoryTitle = prompt('Category Name');
		if(categoryTitle){
			createCategory(categoryTitle);
		}
	}
	
	// select category
	$scope.selectCategory = function(category, index){
		console.log('selectCategory');
		$scope.activeCategory = category;
		Categories.setLastActiveIndex(index);
		
		$ionicSideMenuDelegate.toggleLeft(false);
	}
	
	// Load Modal
	$ionicModal.fromTemplateUrl('new-task.html', function(modal){
		console.log('load modal');
		$scope.taskModal = modal
	},{
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	// create new task
	$scope.createTask = function(task){
		console.log('createTask');
		// check if category or task exiast and push into array
		if(!$scope.activeCategory || !task){
			return;
		}
		$scope.activeCategory.tasks.push({
			title: task.title
		});
		
		// save category, hide modal and clear the form
		$scope.taskModal.hide();
		Categories.save($scope.categories);
		task.title = '';
	}
	
	// remove task
	$scope.removeTask = function(task){
		console.log('removeTask ' + task.title);
		// loop through tasks
		for(i=0; i<$scope.activeCategory.tasks.length; i++){
			if($scope.activeCategory.tasks[i].title == task.title){
				// remove current item from array and save
				$scope.activeCategory.tasks.splice(i, 1);
				Categories.save($scope.categories);
			}
		}
	}
	
	// open modal
	$scope.newTask = function(){
		console.log('newTask');
		$scope.taskModal.show();
	}
	
	// close modal
	$scope.closeNewTask = function(){
		console.log('closeNewTask');
		$scope.taskModal.hide();
	}
	
	// toggle
	$scope.toggleCategories = function(){
		console.log('toggle');
		$ionicSideMenuDelegate.toggleLeft();
	}
	
	$timeout(function(){
		// check if categories exist
		if($scope.categories.length == 0){
			while(true){
				var categoryTitle = prompt('Please Create A Category');
				if(categoryTitle){
					createCategory(categoryTitle);
					break;
				}
			}
		}
	});
});