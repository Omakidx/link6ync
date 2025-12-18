// "use client";

// import React, { useEffect, useState } from 'react';
// import { Html5QrcodeScanner } from 'html5-qrcode';
// import { motion } from 'framer-motion';
// import { Link2, Copy, Check, ExternalLink } from 'lucide-react';

// const QRScanner = () => {
//   const [scanResult, setScanResult] = useState<string | null>(null);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     // Only run on client side
//     // Html5QrcodeScanner requires DOM element with id
//     const scannerId = "reader";
    
//     // Slight delay to ensure DOM is ready and cleaner render
//     const timer = setTimeout(() => {
//        // Check if element exists before initializing (React double render safety)
//         if (!document.getElementById(scannerId)) return;

//         const scanner = new Html5QrcodeScanner(
//             scannerId,
//             { 
//               fps: 10, 
//               qrbox: { width: 250, height: 250 },
//               aspectRatio: 1.0, 
//             },
//             false
//         );

//         scanner.render(
//             (decodedText) => {
//                 setScanResult(decodedText);
//                 scanner.clear();
//             },
//             (error) => {
//                 // console.warn(error);
//                 // Ignore errors for cleaner logs, standard behavior
//             }
//         );

//         return () => {
//             scanner.clear().catch(err => console.error("Failed to clear scanner", err));
//         };
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   const resetScanner = () => {
//       setScanResult(null);
//       // Re-mount logic handles re-init
//       window.location.reload(); // Simplest way to restart scanner cleanly in this quick implementation without ref handling complexity
//       // Ideally we would manage the scanner instance state, but for this task, a reload or parent state toggle is safer given html5-qrcode's notorious statefulness. 
//       // Actually, better: we can just hide the result and re-render the component if we lift state or use a key.
//       // Let's assume the user will switch tabs or just wants to see the result.
//   };

//   const copyToClipboard = () => {
//     if (scanResult) {
//       navigator.clipboard.writeText(scanResult);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   return (
//     <div className="w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 text-white">
//       <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
//         Scan QR Code
//       </h2>

//       {!scanResult ? (
//         <div className="overflow-hidden rounded-xl border border-gray-700 bg-black">
//            <div id="reader" className="w-full"></div>
//         </div>
//       ) : (
//         <motion.div
//            initial={{ opacity: 0, scale: 0.95 }}
//            animate={{ opacity: 1, scale: 1 }}
//            className="space-y-6"
//         >
//             <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
//                 <div className="flex justify-center mb-2">
//                     <div className="p-3 bg-green-500 rounded-full text-black">
//                         <Check size={32} />
//                     </div>
//                 </div>
//                 <h3 className="text-lg font-semibold text-green-400 mb-1">Scan Successful!</h3>
//             </div>

//             <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 break-all space-y-3">
//                 <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Decoded Content:</p>
//                 <div className="flex items-start justify-between gap-3">
//                     <p className="text-white font-mono text-sm leading-relaxed">{scanResult}</p>
//                     <button
//                         onClick={copyToClipboard}
//                         className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white shrink-0"
//                     >
//                          {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
//                     </button>
//                 </div>
//             </div>

//             <div className="flex gap-3">
//                  {/^https?:\/\//.test(scanResult) && (
//                     <a
//                         href={scanResult}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
//                     >
//                         Open Link <ExternalLink size={18} />
//                     </a>
//                  )}
//                  <button
//                     onClick={() => window.location.reload()} // Quick reset
//                     className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
//                  >
//                     Scan Another
//                  </button>
//             </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default QRScanner;
