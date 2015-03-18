/*
 * Spec for testing register/ deregister for update
 */

// Check which versions to run for
if ((pluginMajorVersion == 2 && pluginMinorVersion >= 2) ||
	 pluginMajorVersion == 3) {
	
	describe("When testing for update listener", function() {
		
		spec_start();
	
		spec_enable();
		
		spec_register_for_update()
		
		spec_disable();	
		
		spec_stop();
	
	});
}
	
function spec_register_for_update() {
	it("it be able to register and deregister for updates", function() {
		var previousResult = '';
		var	latestResult = '';

		// Register for the updates
		runs(function() {
			flag = false;
			success = false;
			
			myService.registerForUpdates(function(data) {
											success = true;
											latestResult = data.LatestResult.Message;
											flag = true;
										},
										function(data) {
											flag = true;
										});
		});

		waitsFor(function() {return flag;}, "Flag should be set", 2 * 60 * 1000);

		runs(function() {
			expect(success).toBe(true);
		}); 
	
		// Wait for 60 seconds - doWork() should run at least once 
		spec_wait(60 * 1000);

		// We should have received valid results
		runs(function() {
			expect(success).toBe(true);
			expect(latestResult).toMatch('^Hello');
			expect(latestResult).not.toEqual(previousResult);
			
			previousResult = latestResult;
		}); 
		
		// Wait for 60 seconds - doWork() should run at least once 
		spec_wait(60 * 1000);

		// Now we should have different results
		runs(function() {
			expect(success).toBe(true);
			expect(latestResult).toMatch('^Hello');
			expect(latestResult).not.toEqual(previousResult);
			
			previousResult = latestResult;
		}); 
		
		// Now deregister for updates
		runs(function() {
			flag = false;
			success = false;
			
			myService.deregisterForUpdates(function() {
												success = true;
												flag = true;
											},
											function(data) {
												flag = true;
											});
		});

		waitsFor(function() {return flag;}, "Flag should be set", 2 * 60 * 1000);

		runs(function() {
			expect(success).toBe(true);
		}); 
	
		// Wait for 60 seconds - doWork() should run at least once 
		spec_wait(60 * 1000);

		// Now get the status - it should be no different than the latestResult
		runs(function() {
			flag = false;
			success = false;
			latestResult = "";
			
			myService.getStatus(function(data) {
									success = true;
									latestResult = data.LatestResult.Message;
									flag = true;
								},
								function(data) {
									flag = true;
								});
		});
		
		waitsFor(function() {return flag;}, "Flag should be set", 2 * 60 * 1000);
		
		// Now we shouldn't have different results
		runs(function() {
			expect(success).toBe(true);
			expect(latestResult).toMatch('^Hello');
			expect(latestResult).toEqual(previousResult);
		}); 
				
	});
}

