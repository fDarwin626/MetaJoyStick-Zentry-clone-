import { useState, useEffect } from "react";

const Footer = () => {

  const [ currentYear, setCurrentYear] = useState( new Date().getFullYear());
 useEffect(() => {
    setCurrentYear(new Date().getFullYear());
 }, [])
   
  return (
    <footer className='w-screen bg-violet-300 py-4 text-black'>
        <div className="marquee-container">
            <p className="marquee text-4xl font-zentry">
              <span>feeling Impressed?&nbsp;&nbsp;&nbsp; now imagine i code your website&nbsp;&nbsp;&nbsp; ©Gamic {currentYear}. all rights reserve&nbsp;&nbsp;&nbsp; ★ &nbsp;&nbsp;&nbsp;</span>
              <span>feeling Impressed?&nbsp;&nbsp;&nbsp; now imagine i code your website&nbsp;&nbsp;&nbsp; ©Gamic {currentYear}. all rights reserve&nbsp;&nbsp;&nbsp; ★ &nbsp;&nbsp;&nbsp;</span>
              <span>feeling Impressed?&nbsp;&nbsp;&nbsp; now imagine i code your website&nbsp;&nbsp;&nbsp; ©Gamic {currentYear}. all rights reserve&nbsp;&nbsp;&nbsp; ★ &nbsp;&nbsp;&nbsp;</span>
              <span>feeling Impressed?&nbsp;&nbsp;&nbsp; now imagine i code your website&nbsp;&nbsp;&nbsp; ©Gamic {currentYear}. all rights reserve&nbsp;&nbsp;&nbsp; ★ &nbsp;&nbsp;&nbsp;</span>
              <span>feeling Impressed?&nbsp;&nbsp;&nbsp; now imagine i code your website&nbsp;&nbsp;&nbsp; ©Gamic {currentYear}. all rights reserve&nbsp;&nbsp;&nbsp; ★ &nbsp;&nbsp;&nbsp;</span>           
              <span>feeling Impressed?&nbsp;&nbsp;&nbsp; now imagine i code your website&nbsp;&nbsp;&nbsp; ©Gamic {currentYear}. all rights reserve&nbsp;&nbsp;&nbsp; ★ &nbsp;&nbsp;&nbsp;</span>
            </p>
        </div>
    </footer>
  )
}

export default Footer