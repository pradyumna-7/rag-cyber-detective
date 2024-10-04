import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState([]);

  const handleScrape = async () => {
    const toastID = toast.loading('Scraping...', { duration: Infinity });
    try {
      const { data } = await axios.post('/scrape', { url });

      if (data.error) {
        toast.dismiss(toastID);
        toast.error(data.error);
      } else {
        toast.dismiss(toastID);
        toast.success(data.success);
        setTags(data.tags);
      }
    } catch (error) {
      toast.dismiss(toastID);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-lg max-w-4xl w-full mx-4 my-8 flex flex-col max-h-[90vh]">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Cybersecurity Web Scraper</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <input
            type="url"
            placeholder="Enter URL to scrape"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow px-4 py-2 bg-white bg-opacity-20 rounded-md text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleScrape}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Scrape
          </button>
        </div>

        {tags.length > 0 && (
          <div className="overflow-auto flex-grow">
            <table className="w-full text-white">
              <thead className="sticky top-0 bg-blue-900 bg-opacity-100">
                <tr>
                  <th className="px-4 py-2">Word</th>
                  <th className="px-4 py-2 ">Tag</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white bg-opacity-10' : 'bg-gray bg-opacity-10'} hover:bg-opacity-30 transition-colors`}>
                    <td className="px-4 py-2">{tag.word}</td>
                    <td className="px-4 py-2">{tag.tag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}