//one way to do it - this function would require parameters 
//that specify the time we are interested in
function checkRecords(DateStart, DateEnd){
	var selectQuery = `SELECT * FROM PhoneCalls WHERE DateStart >= ${DateStart} AND DateEnd <= ${DateEnd}`;
	connection.query(selectQuery, (error, results)=>{
		if (error){
			throw (error)
		}else{
			// results will comeback as an array so we just have to determine
			// how many elements in this array
			var numberOfCalls = results.length;
		}
	})
	return numberOfCalls;
}