export default function MapView({latitude,longitude,name='Location',height=320}){
  if(latitude==null||longitude==null)return <div className="map-empty">Location coordinates are unavailable.</div>;
  const lat=Number(latitude),lon=Number(longitude),delta=.015;
  const src=`https://www.openstreetmap.org/export/embed.html?bbox=${lon-delta}%2C${lat-delta}%2C${lon+delta}%2C${lat+delta}&layer=mapnik&marker=${lat}%2C${lon}`;
  return <div style={{height,width:'100%',borderRadius:18,overflow:'hidden'}}><iframe title={`${name} map`} src={src} style={{border:0,width:'100%',height:'100%'}} loading="lazy"/></div>;
}
