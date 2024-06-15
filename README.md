# Birds in the Neighborhood
![birds](https://github.com/chrissygonzalez/bird-checklists/assets/8127482/aad2e5a0-bf6d-4856-9ea8-e89fcf5394ef)

This is a small client for the [eBird](https://ebird.org/home) API's ['Recent nearby observations'](https://documenter.getpostman.com/view/664302/S1ENwy59#62b5ffb3-006e-4e8a-8e50-21d90d036edc) endpoint, with calls to related endpoints, such as ['View checklist'](https://documenter.getpostman.com/view/664302/S1ENwy59#2ee89672-4211-4fc1-8493-5df884fbb386). Initially built as a venue for practicing writing fetch requests and implementing state management using React Context, Birds in the Neighborhood continues to be a work in progress. I'm currently adding accessibility features (I know, I should have started with these!) and tests.

The design of the site evolved organically as I tried displaying the bird observations different ways. My goal was to take the list of observations eBird delivered and organize them, such that they might reveal some interesting piece of information quickly. After a bit of experimentation, I settled on:
- **By date**, sub-organized by location. This shows what days the most birds have been seen (usually, weekends) and what locations have been the site of specific sightings. Clicking on locations will take you straight to the map. (I'm currently working on allowing users to click on bird names here, as well.)
- **By bird name**, alphabetical. This is fun for seeing what birds are in an area, if you browse around different areas (and if you think birds are fun). Here, you can click on a bird name and see the list of observations (an eBird 'checklist') of which it was an entry. If a name was recorded on the checklist, you can see that, too. (This is how  I discovered that an acquaintance from college is an avid birder.)
- **By location**, as visualized on a Google Map. This the natural outcome of having a list of locations, plus it's fun to see unofficial birding spots like '*my house*' and '*the dump*' laid out with everything else.

### See it live
[Currently deployed on Vercel here](https://bird-checklists.vercel.app/)

### How to install
1. Clone the repo to a location of your choosing.
2. Run `npm install` to install the dependencies.
3. Run `npm run dev` to run locally.

### This project uses:
- Vite's [React-Typescript-Vite template](https://github.com/vitejs/vite/tree/main/packages/create-vite)
- React
- Typescript
- [react-google-maps](https://github.com/visgl/react-google-maps)
- npm
- Cormorant, Langar, and Merriweather from [Google Fonts](https://fonts.google.com/)
- a lovely icon purchased from the [Noun Project](https://thenounproject.com/)