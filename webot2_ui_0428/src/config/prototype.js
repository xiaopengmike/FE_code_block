const handlers = {
	accuracy(){
		//精度处理如0.3571*100 = 35.70199999999999999999；
		Number.prototype.toAccuracy = function(num){
			return (this + 0.0005).toFixed(num);
		}
	}
}
export default ()=>{
	handlers.accuracy();
}