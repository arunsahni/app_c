e strict';

angular.module('collabmedia', [
  'ngRoute',
  'collabmedia.services',
  'collabmedia.controllers'
]).
config(function($routeSegmentProvider, $routeProvider) {

	$routeSegmentProvider.options.autoLoadTemplates = true;
	$routeSegmentProvider
		.when('/admin', 'admin')
		.when('/admin/manage', 'admin.manage')
		.when('/admin/manage/metametatag', 'admin.manage.metametatag')
		.when('/admin/manage/metatag/:mmtid', 'admin.manage.metatag')
		.when('/admin/manage/grouptag/:mtid', 'admin.manage.grouptag')
		.when('/admin/manage/domain', 'admin.manage.domain')
		.when('/admin/manage/fsg/agegroup', 'admin.manage.fsg.agegroup')
		.when('/admin/manage/fsg/country', 'admin.manage.fsg.country')
		.when('/admin/capsule', 'admin.capsule')
		.when('/admin/capsule/create', 'admin.capsule.create');
		
	$routeSegmentProvider
		.segment('admin', {templateURL : 'views/admin/default.html', controller : 'admin'})
		.within()
			.segment('manage', {templateURL : 'views/admin/manage/default.html', controller : 'admin-manage'})
			.within()
				.segment('metametatag', {templateURL : 'views/admin/manage/metametatag.html', controller : 'admin-manage-metametatag'})
				.segment('metatag', {templateURL : 'views/admin/manage/metatag.html', controller : 'admin-manage-metatag', dependencies : ['mmtid']})
				.segment('grouptag', {templateURL : 'views/admin/manage/grouptag.html', controller : 'admin-manage-grouptag', dependencies : ['mtid']})
				.segment('domain', {templateURL : 'views/admin/manage/domain.html', controller : 'admin-manage-domain'})
				.segment('fsg', {templateURL : 'views/admin/manage/fsg/default.html', controller : 'admin-manage-fsg'})
				.within()
					.segment('agegroup', {templateURL : 'views/admin/manage/fsg/agegroup.html', controller : 'admin-manage-fsg-agegroup'})
					.segment('country', {templateURL : 'views/admin/manage/fsg/country.html', controller : 'admin-manage-fsg-country'})
				.up()
			.up()
			.segment('capsule', {templateURL : 'views/admin/capsule/default.html', controller : 'admin-capsule'})
				.within()
					.segment('capsule', {templateURL : 'views/admin/capsule/create.html', controller : 'admin-capsule-create'});
}]);
