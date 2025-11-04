import { useRef } from "react"
import AnimatedTitle from "./AnimatedTitle"
import gsap from "gsap";
import RoundedCorners from "./RoundedCorners";
import Button from "./Button";
const Story = () => {

  const frameRef = useRef('null');
  const handleMouseLeave = () => {
    const element = frameRef.current;
    gsap.to(element, {
      duration: 0.3,
      rotateX: 0,
      rotateY: 0,
      ease: 'power1.inOut',
    })

  }

  const handleMouseMove = (e) => {
    const {clientX,clientY } = e;
    const element = frameRef.current;
    if(!element) return;
    const rect = element.getBoundingClientRect();
    const x_pos = clientX - rect.left;
    const y_pos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y_pos - centerY) / centerY) * -10;
    const rotateY = ((x_pos - centerX) / centerX) * 10;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: 'power1.inOut',
    })

  }

  return (
    <section id='prologue' className='min-h-dvh w-screen bg-black
    text-blue-50'>
        <div className="flex size-full flex-col items-center
        py-10 pb-24">
           <p className="font-general text-sm uppercase md:text-[10px]
           ">
             Enter the MetaJoyStick multiverse
            </p> 
            <div className="relative size-full">
                <AnimatedTitle
                title='the st<b>o</b>ry of <br/> a hidd<b>e</b>n realm'
                sectionId='#story'
                containerClass='mt-5 pointer-events-none mix-blend-difference
                relative z-10'
                />
                <div className="story-img-container">
                  <div className="story-img-mask">
                    <div className="story-img-content">
                      <img
                        ref={frameRef}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseLeave}
                        onMouseEnter={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                        src='/img/entrance.webp'
                        alt="enterance"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <RoundedCorners/>
                </div>
            </div>
            <div className="-mt-80 justify-center flex w-full md:-mt-64
            md:me-44 md:justify-end">
              <div className="flex h-full w-fit flex-col items-center
              md:items-start">
                    <p className="mt-10 max-w-sm text-center font-circular text-violet-200
                    md:text-start">
                      where realms converge, lies MetaJoyStick. Discover items
                      secrets and shape your your fate amidst infinite possibilities
                      where dreams are only an NFT token away.
                    </p>
                    <Button id='realm-button' title='discover prologue'
                    containerClass='mt-5'/>
              </div>
            </div>
        </div>
    </section>

  )
}

export default Story