const ThemeShowcase = () => {
  return (
    <div className="bg-snow min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-night">Main Header</h1>
          <h2 className="text-2xl text-celtic-blue">Secondary Header</h2>
          <p className="text-night">Regular text in Night color</p>
        </div>

        <div className="space-x-4">
          <button className="bg-celtic-blue text-snow px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">
            Primary Button
          </button>
          <button className="border-2 border-celtic-blue text-celtic-blue px-4 py-2 rounded-lg hover:bg-celtic-blue hover:text-snow transition-all">
            Secondary Button
          </button>
          <button className="bg-bittersweet text-snow px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">
            Accent Button
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-snow p-6 rounded-lg shadow-md border border-celtic-blue">
            <h3 className="text-xl font-bold text-celtic-blue mb-2">Card Title</h3>
            <p className="text-night mb-4">This is a sample card with primary border.</p>
            <button className="bg-celtic-blue text-snow px-3 py-1 rounded hover:bg-opacity-90 transition-all">
              Learn More
            </button>
          </div>
          <div className="bg-celtic-blue p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-snow mb-2">Inverted Card</h3>
            <p className="text-snow mb-4">This is a sample card with inverted colors.</p>
            <button className="bg-snow text-celtic-blue px-3 py-1 rounded hover:bg-opacity-90 transition-all">
              Learn More
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Input field" 
            className="w-full p-2 border border-celtic-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue"
          />
          <select className="w-full p-2 border border-celtic-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue">
            <option>Select option</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default ThemeShowcase
