import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import tallTreesImg from '../assets/images/tall_trees_forest_1784989941847.jpg';

export const StoryImageSection: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  return (
    <section ref={containerRef} className="bg-black py-16 md:py-24 px-6 overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-neutral-900"
        >
          <img
            src={tallTreesImg}
            alt="Majestic tall trees in quiet nature forest"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover max-h-[80vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Story Text Below Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 max-w-2xl w-full text-xs md:text-sm text-white/75 leading-relaxed space-y-4 font-light tracking-wide"
        >
          <p>
            <strong className="text-white font-semibold">The tallest trees were once invisible seeds.</strong>
          </p>

          <p>
            No one admired them.
            <br />
            No one believed in what they would become.
            <br />
            They grew in silence, hidden beneath the soil,
            <br />
            where no applause could reach them.
          </p>

          <p className="text-white/90">
            Your life is often the same.
          </p>

          <p>
            There will be seasons when your efforts seem unnoticed.
            <br />
            You'll work while others celebrate.
            <br />
            You'll keep learning while others chase shortcuts.
            <br />
            Some people will call your patience a waste of time.
            <br />
            Others will doubt your dreams because they cannot see what you see.
          </p>

          <p className="text-white/90 font-medium">
            Don't let their vision become your limit.
          </p>

          <p>
            The greatest transformations happen long before the world notices them.
            <br />
            Roots grow before branches.
            <br />
            Character grows before success.
            <br />
            Discipline grows before confidence.
          </p>

          <p>
            One day, people will call your achievements "luck."
            <br />
            They will admire the results,
            <br />
            but they will never see the mornings you woke up tired,
            <br />
            the nights you questioned yourself,
            <br />
            or the countless moments when quitting felt easier than continuing.
          </p>

          <p className="text-white/90">
            Remember this—
          </p>

          <p>
            A seed never competes with the trees around it.
            <br />
            It simply keeps growing.
          </p>

          <p>
            Life isn't about proving your worth to everyone.
            <br />
            It's about becoming the person you promised yourself you would be.
          </p>

          <p className="pt-2">
            <strong className="text-white font-semibold">Because the quietest growth often creates the strongest future.</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
});

StoryImageSection.displayName = 'StoryImageSection';

