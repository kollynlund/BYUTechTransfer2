( tc.pages > 7 											// Are there enough pages to worry about an offset?
	? ( tc.$storage.currentPage > 1 					// Is this the first or second page?
		? ( (tc.$storage.currentPage + 4) < tc.pages 	// Are we far enough from the end of the list to apply an offset?
			? tc.$storage.currentPage - 3 
			: tc.pages - 7
		  ) 
		: 0 
	  ) 
	: 0 
)