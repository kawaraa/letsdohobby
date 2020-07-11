import React from "react";

export default (props) => {
  const name = props.name || "";
  return (
    <svg viewBox="0 0 400 400" className={name + " member svg"}>
      <path
        d="m266.55734,285.94344c-14.6768,-7.88648 -20.53714,-29.56123 -20.53714,-29.56123s-6.61234,4.90946 -6.61234,-8.87881s6.61234,8.87881 13.22468,-44.35926c0,0 18.33303,-6.91155 14.6768,-64.06675l-4.40823,0c0,0 11.0076,-61.10714 0,-81.80697c-11.02056,-20.69983 -15.41583,-34.4881 -39.64809,-44.35926s-15.40285,-7.90389 -33.02279,-6.89414c-17.61994,0.99234 -32.3097,13.78828 -32.3097,20.68241c0,0 -11.0076,0.99234 -15.40285,6.91155c-4.40823,5.91921 -11.74663,33.49576 -11.74663,40.40731s3.6692,53.23807 7.3384,63.09182l-4.36933,1.96727c-3.6692,57.15519 14.6768,64.06675 14.6768,64.06675c6.59938,53.23807 13.21171,30.57098 13.21171,44.35926s-6.61234,8.87881 -6.61234,8.87881s-5.86035,21.67476 -20.53714,29.56123c-14.6768,7.86907 -96.15118,50.24365 -102.77648,59.12247c-6.6253,8.89623 -5.87331,50.27847 -5.87331,50.27847l349.37781,0c0,0 0.76496,-41.38224 -5.86035,-50.27847c-6.63827,-8.87881 -88.11265,-51.2534 -102.78945,-59.12247l-0.00001,0zm-161.67815,-2.99442c-1.28357,-3.1337 -1.91887,-5.39693 -1.91887,-5.39693s-5.60103,4.16085 -5.60103,-7.52087s5.60103,7.52087 11.20208,-37.58699c0,0 15.54548,-5.84957 12.43379,-54.30005l-3.73402,0c0,0 1.85405,-10.28898 3.07279,-23.2242c-0.05186,-5.36211 0.07779,-11.07241 0.47972,-17.33981l0.49268,-7.41643c-0.27227,-8.56544 -1.38729,-16.34746 -4.0452,-21.34398c-9.33507,-17.53131 -13.06909,-29.23045 -33.59327,-37.58699c-20.52418,-8.35654 -13.06909,-6.70264 -27.99223,-5.84957c-14.93611,0.83565 -27.38286,11.68174 -27.38286,17.54871c0,0 -9.33507,0.83565 -13.06909,5.84957c-3.51361,4.71796 -9.14059,25.45261 -9.81478,32.8168l0,4.89206c0.60937,11.36836 3.34506,42.63572 6.08076,49.99992l-3.7081,1.6713c-3.09873,48.45048 12.43379,54.30005 12.43379,54.30005c5.60103,45.10786 11.20208,25.90525 11.20208,37.58699s-5.60103,7.52087 -5.60103,7.52087s-4.96574,18.40178 -17.41249,25.05218c-0.79088,0.41783 -1.80219,0.97493 -3.00797,1.60166l0,91.12102l7.45508,0c-0.376,-22.24927 0.99833,-50.95744 9.67217,-62.56953c4.61567,-6.18035 19.74626,-16.34746 82.35603,-49.82582l-0.00003,0.00002zm289.51669,-157.6599c-0.51861,-6.58076 -1.6466,-12.44775 -3.78589,-16.46934c-9.3221,-17.54871 -13.06909,-29.23045 -33.58031,-37.58699c-20.53714,-8.35654 -13.06909,-6.70264 -28.0052,-5.84957c-14.92314,0.83565 -27.36989,11.68174 -27.36989,17.54871c0,0 -9.3221,0.83565 -13.06909,5.84957c-3.51361,4.73537 -9.19245,25.62669 -9.82776,32.92126l0.42786,0l1.03723,15.89482c0.25931,4.02158 0.28524,7.59051 0.35006,11.22909c1.16688,11.59468 2.72273,23.50274 4.27857,27.6636l-3.7081,1.6713c-3.09873,48.45048 12.44675,54.30005 12.44675,54.30005c5.60103,45.10786 11.18911,25.90525 11.18911,37.58699s-5.60103,7.52087 -5.60103,7.52087s-0.68717,2.47215 -2.11336,5.88439c61.84481,33.07794 76.84574,43.17542 81.40956,49.33836c8.6868,11.6121 10.04817,40.30286 9.67217,62.56953l6.22338,0l0,-92.3745c-0.20745,-0.10446 -0.49268,-0.26114 -0.67419,-0.3656c-12.43379,-6.66782 -17.41249,-25.05218 -17.41249,-25.05218s-5.61401,4.16085 -5.61401,-7.52087s5.61401,7.52087 11.20208,-37.58699c0,0 10.42415,-3.98677 12.48565,-32.05078l0,-21.36138c-0.01296,-0.31337 -0.01296,-0.57451 -0.0389,-0.88789l-3.74699,0c0,0 2.78756,-15.4944 3.78589,-32.39897l0,-20.47351l0.0389,0l0.00001,0.00001z"
        className={name + " member svg-stroke"}
      />
    </svg>
  );
};