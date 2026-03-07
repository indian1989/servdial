export const getUserCity = async () => {

if (!navigator.geolocation) {
return null;
}

return new Promise((resolve) => {

navigator.geolocation.getCurrentPosition(
async (position) => {

const lat = position.coords.latitude;
const lon = position.coords.longitude;

try {

const res = await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
);

const data = await res.json();

const city =
data.address.city ||
data.address.town ||
data.address.village ||
data.address.state;

resolve(city);

} catch (error) {

console.log("Location error", error);

resolve(null);

}

},
() => resolve(null)
);

});
};