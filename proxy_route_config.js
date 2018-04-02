var proxyConfig = {
	"development":{
		'/evnCatalog':'http://3.209.34.55:8010',
		'/taxanomy':'http://3.209.34.55:8016/api/v1/taxonomy'
	//	'/evnCatalog':'http://ec2-52-25-199-162.us-west-2.compute.amazonaws.com:8080/analytic-taxonomy-0.0.1-SNAPSHOT',
	//	'/taxanomy': 'http://ec2-52-25-199-162.us-west-2.compute.amazonaws.com:8080/evn-catalog-service-0.0.1-SNAPSHOT/api/v1/taxonomy' 

	}
}
 module.exports = {
	proxyConfig: proxyConfig
};
