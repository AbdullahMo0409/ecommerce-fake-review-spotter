"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { TypewriterText } from '@/components/TypewriterText';
import DynamicBackground from '@/components/figma/DynamicBackGround';
import { motion, AnimatePresence } from 'framer-motion';

type AnalysisState = 'idle' | 'loading' | 'complete';
type Verdict = 'authentic' | 'fake';

export default function Home() {
  const [reviewText, setReviewText] = useState('');
  const [state, setState] = useState<AnalysisState>('idle');
  const [verdict, setVerdict] = useState<Verdict>('authentic');
  const [confidence, setConfidence] = useState(94);
  const [explanation, setExplanation] = useState('');
  const [showCheckAnother, setShowCheckAnother] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const TEXTAREA_MAX = 200; // px

useEffect(() => {
  const ta = textareaRef.current;
  if (!ta) return;

  // Reset then expand up to max height
  ta.style.height = 'auto';
  const newH = Math.min(ta.scrollHeight, TEXTAREA_MAX);
  ta.style.height = `${newH}px`;

  // Only allow inner scrolling once content exceeds max
  if (ta.scrollHeight > TEXTAREA_MAX) {
    ta.style.overflowY = 'auto';
  } else {
    ta.style.overflowY = 'hidden';
  }
}, [reviewText]);
    
    const handleAnalyze = () => {
      if (!reviewText.trim()) return;
  
      setState('loading');
      setShowCheckAnother(false);
  
      // Simulate AI analysis
      setTimeout(() => {
        const isAuthentic = Math.random() > 0.5;
        const confidenceValue = Math.floor(Math.random() * 15) + 85;
        
        setVerdict(isAuthentic ? 'authentic' : 'fake');
        setConfidence(confidenceValue);
        setExplanation(
          isAuthentic
            ? "The review demonstrates natural language patterns with specific product details and balanced perspectives. The writing style is consistent with genuine customer experiences."
            : "The review contains multiple hyperbolic adjectives and repetitive product mentions. These linguistic patterns often indicate inorganic or incentivized reviews."
        );
        setState('complete');
      }, 2500);
    };

  const handleReset = () => {
    setReviewText('');
    setState('idle');
    setExplanation('');
    setShowCheckAnother(false);
  };

  const handleTypingComplete = () => {
    setShowCheckAnother(true);
  };

  return (
  <div className="relative w-screen h-screen overflow-hidden">
    <DynamicBackground speedMultiplier={5} />

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header - Balanced margins */}
        <header className="flex items-center justify-between px-20 pt-7 pb-5">
          <div 
            className="logo-glow text-white"
            style={{
              fontSize: '30px',
              fontWeight: '800',
              letterSpacing: '-0.5px',
              paddingLeft: '40px',
              paddingTop: '20px'
            }}
            
          >
            Authi
          </div>
          
          <nav className="flex items-center" style={{ gap: '40px', paddingRight: '8px', paddingTop: '10px' }}>
            <button className="nav-link text-white" style={{ fontSize: '16px'}}>
              About
            </button>
            <button className="nav-link text-white" style={{ fontSize: '16px', paddingRight: '30px' }}>
              Start Reviewing
            </button>
          </nav>
        </header>

        {/* Main Content - Raised slightly upward (10-15%) */}
        <main 
          className="flex-1 flex flex-col items-center px-20" 
          style={{ 
            marginTop: '-10px',
            paddingTop: '100px',
          }}
        >
          {/* Input Box - 60-65% width, 110-120px height */}
          <div
            className="bg-white rounded-2xl relative"
            style={{
              width: '40%',
              minHeight: '11px',
              padding: '18px', // small padding around
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              marginBottom: '45px',
              transition: 'all 0.15s ease',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
              {/* textarea column */}
              <div style={{ flex: 1, minWidth: 0 /* important for flex */ }}>
                <textarea
                  ref={textareaRef}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Paste or type a product review here..."
                  className="w-full bg-transparent outline-none resize-none text-[#0B132B] placeholder:text-[#808080]"
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.5',
                    minHeight: '60px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '8px 12px',
                    boxSizing: 'border-box',
                    transition: 'height 0.12s ease',
                    border: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* send button column (fixed width) */}
              <div style={{ width: '72px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px' }}>
                <button
                  onClick={handleAnalyze}
                  disabled={!reviewText.trim() || state === 'loading'}
                  className="send-btn rounded-full flex items-center justify-center"
                  style={{
                    position: 'relative',
                    width: '42px',
                    height: '42px',
                    bottom: '-2px',
                    right: '-10px',  
                    backgroundColor: '#1A1A1A',
                  }}
                >
                  <Send className="w-[18px] h-[18px] text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {state === 'loading' && (
            <div className="flex items-center" style={{ gap: '12px', marginTop: '25px' }}>
              <div 
                className="dot-1 rounded-full"
                style={{ 
                  width: '10px', 
                  height: '10px',
                  backgroundColor: '#C9D1D9' 
                }}
              />
              <div 
                className="dot-2 rounded-full"
                style={{ 
                  width: '10px', 
                  height: '10px',
                  backgroundColor: '#C9D1D9' 
                }}
              />
              <div 
                className="dot-3 rounded-full"
                style={{ 
                  width: '10px', 
                  height: '10px',
                  backgroundColor: '#C9D1D9' 
                }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
          {/* Result Display */}
          {state === 'complete' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isTransitioning ? 0 : 1,
                y: isTransitioning ? 20 : 0,
              }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex flex-col items-center"
              style={{ marginTop: '25px' }}
            >
              {/* Verdict Text */}
              <div className="fade-in-up flex items-center" style={{ gap: '18px', marginBottom: '10px' }}>
                <h1 
                  className={verdict === 'authentic' ? 'glow-authentic' : 'glow-fake'}
                  style={{
                    fontSize: '52px',
                    fontWeight: '800',
                    letterSpacing: '-0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {verdict === 'authentic' ? 'Authentic' : 'Fake'}
                </h1>
        
                {/* Icon */}
                {verdict === 'authentic' ? (
                  <CheckCircle 
                    className="scale-in"
                    style={{
                      width: '32px',
                      height: '32px',
                      color: '#00FF9C',
                      strokeWidth: 2.5,
                      filter: 'drop-shadow(0 0 12px rgba(0, 255, 156, 0.5))',
                    }}
                  />
                ) : (
                  <XCircle 
                    className="scale-in"
                    style={{
                      width: '32px',
                      height: '32px',
                      color: '#FF6F61',
                      strokeWidth: 2.5,
                      filter: 'drop-shadow(0 0 12px rgba(255, 111, 97, 0.5))',
                    }}
                  />
                )}
              </div>
        
              {/* Confidence Label + Bar */}
              <div className="fade-in-up flex flex-col items-center" style={{ marginBottom: '38px' }}>
                <div 
                  style={{
                    fontSize: '18px',
                    color: '#C9D1D9',
                    marginBottom: '6px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Confidence: {confidence}%
                </div>
                
                <div 
                  className="relative rounded-full overflow-hidden"
                  style={{
                    width: '200px',
                    height: '6px',
                    backgroundColor: 'rgba(201, 209, 217, 0.15)',
                  }}
                >
                  <div 
                    className="confidence-bar-fill absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${confidence}%`,
                      background: verdict === 'authentic' 
                        ? 'linear-gradient(90deg, #00FF9C, #00D67F)' 
                        : 'linear-gradient(90deg, #FF6F61, #FF4A3D)',
                      boxShadow: verdict === 'authentic'
                        ? '0 0 10px rgba(0, 255, 156, 0.5)'
                        : '0 0 10px rgba(255, 111, 97, 0.5)',
                    }}
                  />
                </div>
              </div>
        
              {/* Explanation Text */}
              <div 
                className="explanation-text text-center"
                style={{
                  width: '60%',
                  fontSize: '18px',
                  color: '#C9D1D9',
                  lineHeight: '1.65',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '40px',
                }}
              >
                <TypewriterText text={explanation} speed={35} onComplete={handleTypingComplete} />
              </div>
        
              {/* Check Another Button */}
              {showCheckAnother && (
                <button
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setState('idle');
                      setReviewText('');
                      setIsTransitioning(false);
                    }, 400); // matches fade duration
                  }}
                  className="check-another-btn check-another-btn-hover rounded-lg"
                  style={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    padding: '10px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Check Another
                </button>
              )}
            </motion.div>
          )}
        
          {/* Idle State Hint */}
          {state === 'idle' && !reviewText && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="text-center"
              style={{
                marginTop: '80px',
                fontSize: '18px',
                color: 'rgba(201, 209, 217, 0.4)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Enter a review above to analyze its authenticity
            </motion.div>
          )}
        </AnimatePresence>
                </main>

        {/* Footer - Raised upward */}
        <footer 
          className="flex items-center justify-center pb-10"
          style={{
            gap: '30px',
            marginTop: 'auto',
            paddingBottom: '50px',
          }}
        >
          <button 
            className="footer-link"
            style={{
              fontSize: '14px',
              color: '#A0A0A0',
              fontFamily: 'Inter, sans-serif',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Privacy Policy
          </button>
          <span style={{ color: '#666', fontSize: '14px' }}>•</span>
          <button 
            className="footer-link"
            style={{
              fontSize: '14px',
              color: '#A0A0A0',
              fontFamily: 'Inter, sans-serif',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Contact
          </button>
        </footer>
      </div>
    </div>
  );
}
