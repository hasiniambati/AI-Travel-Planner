import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TripContext } from "../../context/TripContext";

import "./TripPlanner.css";

function TripPlanner() {

const navigate = useNavigate();

const [tripData, setTripData] = useState({

        destination:"",
        startDate:"",
        endDate:"",

        adults:1,
        children:0,
        infants:0,

        travelMode:"",
        tripPurpose:"",

        budget:"",
        travelStyle:"",

        interests:[],
        include:[]

});


const interests=[
            "🌊 Beach",
            "🏔 Mountains",
            "🌿 Nature",
            "🍕 Food",
            "🛍 Shopping",
            "🐾 Wildlife",
            "🏛 Culture",
            "🏰 Historical Places",
            "🌃 Nightlife",
            "🔥 Adventure"
];


const recommendations=[
            "🏨 Hotels",
            "🍽 Restaurants",
            "📍 Tourist Attractions",
            "🚗 Local Transport",
            "🌦 Weather Forecast",
            "💰 Budget Breakdown",
            "🎒 Packing Checklist",
            "🗺 Map & Directions",
            "🌴Nearby Places"
];


function handleChange(e){

setTripData({...tripData,[e.target.name]:e.target.value});}


function updateCount(type,value){

    setTripData({...tripData,[type]:Math.max(type==="adults"?1:0,tripData[type]+value)});
}



function handleArrayChange(type,item){

if(tripData[type].includes(item)){


    setTripData({...tripData,[type]:tripData[type].filter(i=>i!==item)});

}

else{


    setTripData({...tripData,[type]:[...tripData[type],item]});}}



function handleSubmit(e){

    e.preventDefault();

    setTripData(tripData);

    navigate("/trip-result");

}


return(

<section className="planner">


<div className="planner-header">

<h2>✈ Plan Your Perfect Trip</h2>

<p>
Tell AI your preferences and get a personalized itinerary
</p>

</div>



<form onSubmit={handleSubmit}>


<div className="section">

<label>📍 Destination</label>

<input

type="text"

name="destination"

placeholder="Where do you want to go?"

value={tripData.destination}

onChange={handleChange}

/>

</div>




<div className="section">

<h3>📅 Travel Dates</h3>

<div className="date-row">


<input

type="date"

name="startDate"

value={tripData.startDate}

onChange={handleChange}

/>



<input

type="date"

name="endDate"

value={tripData.endDate}

onChange={handleChange}

/>


</div>

</div>





<div className="section">

<h3>💰 Budget</h3>


<input

type="number"

name="budget"

placeholder="Enter your budget"

value={tripData.budget}

onChange={handleChange}

/>


</div>





<div className="section">

<h3>👥 Travellers</h3>


<div className="traveller-box">


{
["adults","children","infants"].map(type=>(


<div className="traveller-item" key={type}>


<span>
{type}
</span>


<div>

<button
type="button"
onClick={()=>updateCount(type,-1)}
>
-
</button>


<strong>
{tripData[type]}
</strong>


<button
type="button"
onClick={()=>updateCount(type,1)}
>
+
</button>


</div>


</div>


))
}


</div>


</div>





<div className="section">

<h3>🚗 Travel Mode</h3>


<div className="option-grid">


{
["Flight","Train","Car","Bus"].map(item=>(

<button

type="button"

className={
tripData.travelMode===item
?"active-option":""
}

onClick={()=>setTripData({
...tripData,
travelMode:item
})}

key={item}

>

{item}

</button>

))

}


</div>

</div>





<div className="section">

<h3>🎯 Trip Purpose</h3>


<div className="option-grid">


{
["Vacation","Business","Adventure","Family"].map(item=>(

<button

type="button"

className={
tripData.tripPurpose===item
?"active-option":""
}

onClick={()=>setTripData({
...tripData,
tripPurpose:item
})}

key={item}

>

{item}

</button>

))

}


</div>

</div>





<div className="section">

<h3>✨ Travel Style</h3>


<div className="option-grid">


{
["Solo","Couple","Family","Friends"].map(item=>(

<button

type="button"

className={
tripData.travelStyle===item
?"active-option":""
}

onClick={()=>setTripData({
...tripData,
travelStyle:item
})}

key={item}

>

{item}

</button>

))

}


</div>

</div>





<div className="section">

<h3>🌎 Select Interests</h3>


<div className="checkbox-grid">


{
interests.map(item=>(

<div

key={item}

className={
tripData.interests.includes(item)
?
"interest-card selected-card"
:
"interest-card"
}


onClick={()=>handleArrayChange("interests",item)}

>

{item}

</div>

))

}


</div>

</div>





<div className="section">

<h3>🤖 Include AI Recommendations</h3>


<div className="checkbox-grid">


{
recommendations.map(item=>(

<div

key={item}

className={
tripData.include.includes(item)
?
"interest-card selected-card"
:
"interest-card"
}


onClick={()=>handleArrayChange("include",item)}

>

{item}

</div>

))

}


</div>


</div>





<button

type="submit"

className="plan-btn"

>

✨ Plan My Trip

</button>



</form>


</section>

);


}


export default TripPlanner;