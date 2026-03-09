const RatingBreakdown = ({ reviews }) => {

const total = reviews.length;

const countStars = (star)=>{
return reviews.filter(r=>r.rating===star).length;
};

return(

<div className="border p-4 rounded">

<h3 className="font-semibold mb-3">
Rating Breakdown
</h3>

{[5,4,3,2,1].map((star)=>{

const count = countStars(star);
const percent = total ? (count/total)*100 : 0;

return(

<div
key={star}
className="flex items-center gap-2 mb-2"
>

<span className="w-6">
{star}⭐
</span>

<div className="flex-1 bg-gray-200 h-2 rounded">

<div
style={{width:`${percent}%`}}
className="bg-yellow-400 h-2 rounded"
/>

</div>

<span className="text-sm">
{count}
</span>

</div>

);

})}

</div>

);

};

export default RatingBreakdown;