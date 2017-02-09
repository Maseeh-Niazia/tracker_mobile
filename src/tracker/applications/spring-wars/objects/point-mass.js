'use strict';

module.exports = {
  name: 'Mass',
  type: 'point',
  radius: 4,
  mass: 0.250,
  color: [ 255, 0, 0, 255 ],
  params: [ 't', 'x', 'y', 'v_x','v_y', 'a_x', 'a_y', 'K' ],
  bounds: {
    'y': {
      min: -1,
      max: 1
    },
    'v_y': {
      min: -3,
      max: 3
    },
    'a_y': {
      min: -5,
      max: 5
    }
  },
  precisions: {
    't': 1,
    'x': 3,
    'default': 2
  },
  start: 1,
  track: false,
  frames: [
    [ -2.000000000E-1, 1.997551453E-1, 0.000000000E0, , , , , ],
    [ -1.000000000E-1, 1.992916763E-1, 0.000000000E0, -9.269380294E-3, -0.000000000E0, , , 1.074017638E-5 ],
    [ 0.000000000E0, 1.979012693E-1, 0.000000000E0, -9.037645786E-2, -0.000000000E0, -1.277850283E0, -0.000000000E0, 1.020988017E-3 ],
    [ 1.000000000E-1, 1.812163847E-1, 0.000000000E0, -2.711293736E-1, -0.000000000E0, -1.820771129E0, -0.000000000E0, 9.188892153E-3 ],
    [ 2.000000000E-1, 1.436753946E-1, 0.000000000E0, -4.611516696E-1, -0.000000000E0, -1.489721833E0, -0.000000000E0, 2.658260780E-2 ],
    [ 3.000000000E-1, 8.898605082E-2, 0.000000000E0, -5.747015782E-1, -0.000000000E0, -9.401800012E-1, -0.000000000E0, 4.128523800E-2 ],
    [ 4.000000000E-1, 2.873507891E-2, 0.000000000E0, -6.395872403E-1, -0.000000000E0, -2.515974651E-1, -0.000000000E0, 5.113397974E-2 ],
    [ 5.000000000E-1, -3.893139723E-2, 0.000000000E0, -6.372698952E-1, -0.000000000E0, 4.965739443E-1, -0.000000000E0, 5.076411491E-2 ],
    [ 6.000000000E-1, -9.871890013E-2, 0.000000000E0, -5.329893669E-1, -0.000000000E0, 1.244745354E0, -0.000000000E0, 3.550970815E-2 ],
    [ 7.000000000E-1, -1.455292706E-1, 0.000000000E0, -3.869966273E-1, -0.000000000E0, 1.688351411E0, -0.000000000E0, 1.872079869E-2 ],
    [ 8.000000000E-1, -1.761182256E-1, 0.000000000E0, -1.969743312E-1, -0.000000000E0, 2.085610566E0, -0.000000000E0, 4.849860896E-3 ],
    [ 9.000000000E-1, -1.849241369E-1, 0.000000000E0, 3.244283103E-2, -0.000000000E0, 2.118715496E0, -0.000000000E0, 1.315671606E-4 ],
    [ 1.000000000E0, -1.696296594E-1, 0.000000000E0, 2.340518524E-1, -0.000000000E0, 1.834013101E0, -0.000000000E0, 6.847533702E-3 ],
    [ 1.100000000E0, -1.381137664E-1, 0.000000000E0, 3.939486625E-1, -0.000000000E0, 1.469858875E0, -0.000000000E0, 1.939944358E-2 ],
    [ 1.200000000E0, -9.083992688E-2, 0.000000000E0, 5.306720218E-1, -0.000000000E0, 8.938330998E-1, -0.000000000E0, 3.520159934E-2 ],
    [ 1.300000000E0, -3.197936201E-2, 0.000000000E0, 5.793362684E-1, -0.000000000E0, 1.853876059E-1, -0.000000000E0, 4.195381398E-2 ],
    [ 1.400000000E0, 2.502732679E-2, 0.000000000E0, 5.584801627E-1, -0.000000000E0, -4.700900006E-1, -0.000000000E0, 3.898751152E-2 ],
    [ 1.500000000E0, 7.971667053E-2, 0.000000000E0, 4.912771556E-1, -0.000000000E0, -9.401800012E-1, -0.000000000E0, 3.016915545E-2 ],
    [ 1.600000000E0, 1.232827579E-1, 0.000000000E0, 3.661405216E-1, -0.000000000E0, -1.496342819E0, -0.000000000E0, 1.675736019E-2 ],
    [ 1.700000000E0, 1.529447748E-1, 0.000000000E0, 1.946569862E-1, -0.000000000E0, -1.853876059E0, -0.000000000E0, 4.736417783E-3 ],
    [ 1.800000000E0, 1.622141551E-1, 0.000000000E0, -9.269380294E-3, -0.000000000E0, -1.906843946E0, -0.000000000E0, 1.074017638E-5 ],
    [ 1.900000000E0, 1.510908988E-1, 0.000000000E0, -1.900222960E-1, -0.000000000E0, -1.655246481E0, -0.000000000E0, 4.513559123E-3 ],
    [ 2.000000000E0, 1.242096959E-1, 0.000000000E0, -3.383323807E-1, -0.000000000E0, -1.337439157E0, -0.000000000E0, 1.430859998E-2 ],
    [ 2.100000000E0, 8.342442264E-2, 0.000000000E0, -4.588343245E-1, -0.000000000E0, -9.136960575E-1, -0.000000000E0, 2.631611717E-2 ],
    [ 2.200000000E0, 3.244283103E-2, 0.000000000E0, -5.237199866E-1, -0.000000000E0, -2.780814088E-1, -0.000000000E0, 3.428532804E-2 ],
    [ 2.300000000E0, -2.131957468E-2, 0.000000000E0, -5.144506063E-1, -0.000000000E0, 3.310492962E-1, -0.000000000E0, 3.308242829E-2 ],
    [ 2.400000000E0, -7.044729023E-2, 0.000000000E0, -4.541996344E-1, -0.000000000E0, 9.004540857E-1, -0.000000000E0, 2.578716349E-2 ],
    [ 2.500000000E0, -1.121595016E-1, 0.000000000E0, -3.383323807E-1, -0.000000000E0, 1.363923100E0, -0.000000000E0, 1.430859998E-2 ],
    [ 2.600000000E0, -1.381137664E-1, 0.000000000E0, -1.761182256E-1, -0.000000000E0, 1.615520565E0, -0.000000000E0, 3.877203673E-3 ],
    [ 2.700000000E0, -1.473831467E-1, 0.000000000E0, -1.390407044E-2, -0.000000000E0, 1.655246481E0, -0.000000000E0, 2.416539685E-5 ],
    [ 2.800000000E0, -1.408945805E-1, 0.000000000E0, 1.529447748E-1, -0.000000000E0, 1.469858875E0, -0.000000000E0, 2.924013019E-3 ],
    [ 2.900000000E0, -1.167941917E-1, 0.000000000E0, 2.873507891E-1, -0.000000000E0, 1.271229297E0, -0.000000000E0, 1.032130950E-2 ],
    [ 3.000000000E0, -8.342442264E-2, 0.000000000E0, 3.985833526E-1, -0.000000000E0, 7.680343672E-1, -0.000000000E0, 1.985858612E-2 ],
    [ 3.100000000E0, -3.707752117E-2, 0.000000000E0, 4.541996344E-1, -0.000000000E0, 2.913233807E-1, -0.000000000E0, 2.578716349E-2 ],
    [ 3.200000000E0, 7.415504235E-3, 0.000000000E0, 4.449302541E-1, -0.000000000E0, -2.251135214E-1, -0.000000000E0, 2.474536638E-2 ],
    [ 3.300000000E0, 5.190852964E-2, 0.000000000E0, 4.148047681E-1, -0.000000000E0, -6.554776065E-1, -0.000000000E0, 2.150787446E-2 ],
    [ 3.400000000E0, 9.037645786E-2, 0.000000000E0, 3.151589300E-1, -0.000000000E0, -1.244745354E0, -0.000000000E0, 1.241564389E-2 ],
    [ 3.500000000E0, 1.149403156E-1, 0.000000000E0, 1.622141551E-1, -0.000000000E0, -1.416890988E0, -0.000000000E0, 3.289179016E-3 ],
    [ 3.600000000E0, 1.228192889E-1, 0.000000000E0, 2.549079581E-2, -0.000000000E0, -1.370544086E0, -0.000000000E0, 8.122258386E-5 ],
    [ 3.700000000E0, 1.200384748E-1, 0.000000000E0, -1.042805283E-1, -0.000000000E0, -1.344060143E0, -0.000000000E0, 1.359303573E-3 ],
    [ 3.800000000E0, 1.019631832E-1, 0.000000000E0, -2.479559229E-1, -0.000000000E0, -1.198398452E0, -0.000000000E0, 7.685267460E-3 ],
    [ 3.900000000E0, 7.044729023E-2, 0.000000000E0, -3.476017610E-1, -0.000000000E0, -7.150664798E-1, -0.000000000E0, 1.510337303E-2 ],
    [ 4.000000000E0, 3.244283103E-2, 0.000000000E0, -3.893139723E-1, -0.000000000E0, -2.913233807E-1, -0.000000000E0, 1.894567113E-2 ],
    [ 4.100000000E0, -7.415504235E-3, 0.000000000E0, -4.032180428E-1, -0.000000000E0, 1.191777466E-1, -0.000000000E0, 2.032309875E-2 ],
    [ 4.200000000E0, -4.820077753E-2, 0.000000000E0, -3.707752117E-1, -0.000000000E0, 6.091307050E-1, -0.000000000E0, 1.718428221E-2 ],
    [ 4.300000000E0, -8.157054658E-2, 0.000000000E0, -2.780814088E-1, -0.000000000E0, 1.059357748E0, -0.000000000E0, 9.666158741E-3 ],
    [ 4.400000000E0, -1.038170593E-1, 0.000000000E0, -1.575794650E-1, -0.000000000E0, 1.191777466E0, -0.000000000E0, 3.103910973E-3 ],
    [ 4.500000000E0, -1.130864396E-1, 0.000000000E0, -3.707752117E-2, -0.000000000E0, 1.271229297E0, -0.000000000E0, 1.718428221E-4 ],
    [ 4.600000000E0, -1.112325635E-1, 0.000000000E0, 9.269380294E-2, -0.000000000E0, 1.191777466E0, -0.000000000E0, 1.074017638E-3 ],
    [ 4.700000000E0, -9.454767900E-2, 0.000000000E0, 2.085610566E-1, -0.000000000E0, 1.019631832E0, -0.000000000E0, 5.437214292E-3 ],
    [ 4.800000000E0, -6.952035220E-2, 0.000000000E0, 2.919854793E-1, -0.000000000E0, 6.223726769E-1, -0.000000000E0, 1.065694001E-2 ],
    [ 4.900000000E0, -3.615058315E-2, 0.000000000E0, 3.383323807E-1, -0.000000000E0, 3.045653525E-1, -0.000000000E0, 1.430859998E-2 ],
    [ 5.000000000E0, -1.853876059E-3, 0.000000000E0, 3.476017610E-1, -0.000000000E0, -1.721456340E-1, -0.000000000E0, 1.510337303E-2 ],
    [ 5.100000000E0, 3.336976906E-2, 0.000000000E0, 3.105242398E-1, -0.000000000E0, -4.899529584E-1, -0.000000000E0, 1.205316294E-2 ],
    [ 5.200000000E0, 6.025097191E-2, 0.000000000E0, 2.410038876E-1, -0.000000000E0, -8.474861983E-1, -0.000000000E0, 7.260359232E-3 ],
    [ 5.300000000E0, 8.157054658E-2, 0.000000000E0, 1.483100847E-1, -0.000000000E0, -9.931478886E-1, -0.000000000E0, 2.749485153E-3 ],
    [ 5.400000000E0, 8.991298885E-2, 0.000000000E0, 3.476017610E-2, -0.000000000E0, -1.105704649E0, -0.000000000E0, 1.510337303E-4 ],
    [ 5.500000000E0, 8.852258181E-2, 0.000000000E0, -6.952035220E-2, -0.000000000E0, -9.534219731E-1, -0.000000000E0, 6.041349213E-4 ],
    [ 5.600000000E0, 7.600891841E-2, 0.000000000E0, -1.598968101E-1, -0.000000000E0, -7.746553531E-1, -2.648394370E-2, 3.195873734E-3 ],
    [ 5.700000000E0, 5.654321979E-2, 0.000000000E0, -2.224651270E-1, -4.634690147E-3, -5.694047895E-1, -1.324197185E-2, 6.189026638E-3 ],
    [ 5.800000000E0, 3.151589300E-2, -9.269380294E-4, -2.734467187E-1, -4.634690147E-3, -3.045653525E-1, 1.324197185E-2, 9.349323538E-3 ],
    [ 5.900000000E0, 1.853876059E-3, -9.269380294E-4, -2.873507891E-1, -0.000000000E0, -2.648394370E-2, 5.296788739E-2, 1.032130950E-2 ],
    [ 6.000000000E0, -2.595426482E-2, -9.269380294E-4, -2.734467187E-1, 4.634690147E-3, 3.310492962E-1, 1.324197185E-2, 9.349323538E-3 ],
    [ 6.100000000E0, -5.283546767E-2, 0.000000000E0, -2.270998172E-1, 4.634690147E-3, 6.753405643E-1, -1.324197185E-2, 6.449475915E-3 ],
    [ 6.200000000E0, -7.137422826E-2, 0.000000000E0, -1.344060143E-1, -0.000000000E0, 9.666639449E-1, -2.648394370E-2, 2.258122084E-3 ],
    [ 6.300000000E0, -7.971667053E-2, 0.000000000E0, -3.244283103E-2, -0.000000000E0, 9.401800012E-1, -0.000000000E0, 1.315671606E-4 ],
    [ 6.400000000E0, -7.786279447E-2, 0.000000000E0, 5.561628176E-2, -0.000000000E0, 7.945183109E-1, -0.000000000E0, 3.866463496E-4 ],
    [ 6.500000000E0, -6.859341417E-2, 0.000000000E0, 1.251366340E-1, -0.000000000E0, 6.488566206E-1, -2.648394370E-2, 1.957397145E-3 ],
    [ 6.600000000E0, -5.283546767E-2, 0.000000000E0, 1.853876059E-1, -4.634690147E-3, 5.031949302E-1, 1.324197185E-2, 4.298755596E-3 ],
    [ 6.700000000E0, -3.151589300E-2, -9.269380294E-4, 2.270998172E-1, -0.000000000E0, 2.780814088E-1, -0.000000000E0, 6.446790871E-3 ],
    [ 6.800000000E0, -7.415504235E-3, 0.000000000E0, 2.410038876E-1, -0.000000000E0, -2.648394370E-2, -0.000000000E0, 7.260359232E-3 ],
    [ 6.900000000E0, 1.668488453E-2, -9.269380294E-4, 2.224651270E-1, -4.634690147E-3, -3.442912681E-1, 1.324197185E-2, 6.189026638E-3 ],
    [ 7.000000000E0, 3.707752117E-2, -9.269380294E-4, 1.714835354E-1, 4.634690147E-3, -5.694047895E-1, 3.972591554E-2, 3.678510410E-3 ],
    [ 7.100000000E0, 5.098159162E-2, 0.000000000E0, 1.065978734E-1, 4.634690147E-3, -7.283084516E-1, -1.324197185E-2, 1.423073370E-3 ],
    [ 7.200000000E0, 5.839709585E-2, 0.000000000E0, 2.780814088E-2, -0.000000000E0, -6.620985924E-1, -2.648394370E-2, 9.666158741E-5 ],
    [ 7.300000000E0, 5.654321979E-2, 0.000000000E0, -3.244283103E-2, -0.000000000E0, -6.488566206E-1, -0.000000000E0, 1.315671606E-4 ],
    [ 7.400000000E0, 5.190852964E-2, 0.000000000E0, -9.269380294E-2, -0.000000000E0, -5.031949302E-1, -0.000000000E0, 1.074017638E-3 ],
    [ 7.500000000E0, 3.800445920E-2, 0.000000000E0, -1.436753946E-1, -0.000000000E0, -3.840171836E-1, -0.000000000E0, 2.580327375E-3 ],
    [ 7.600000000E0, 2.317345073E-2, 0.000000000E0, -1.622141551E-1, -0.000000000E0, -1.986295777E-1, -0.000000000E0, 3.289179016E-3 ],
    [ 7.700000000E0, 5.561628176E-3, 0.000000000E0, -1.853876059E-1, -0.000000000E0, -7.945183109E-2, -0.000000000E0, 4.296070551E-3 ],
    [ 7.800000000E0, -1.390407044E-2, 0.000000000E0, -1.807529157E-1, -0.000000000E0, 2.251135214E-1, -0.000000000E0, 4.083952068E-3 ],
    [ 7.900000000E0, -3.058895497E-2, 0.000000000E0, -1.390407044E-1, -0.000000000E0, 4.369850710E-1, -0.000000000E0, 2.416539685E-3 ],
    [ 8.000000000E0, -4.171221132E-2, 0.000000000E0, -9.037645786E-2, -0.000000000E0, 5.495418317E-1, -0.000000000E0, 1.020988017E-3 ],
    [ 8.100000000E0, -4.866424654E-2, 0.000000000E0, -3.244283103E-2, -0.000000000E0, 5.826467613E-1, -0.000000000E0, 1.315671606E-4 ],
    [ 8.200000000E0, -4.820077753E-2, 0.000000000E0, 3.012548595E-2, -0.000000000E0, 5.098159162E-1, -0.000000000E0, 1.134431130E-4 ],
    [ 8.300000000E0, -4.263914935E-2, 0.000000000E0, 6.952035220E-2, -0.000000000E0, 3.442912681E-1, -0.000000000E0, 6.041349213E-4 ],
    [ 8.400000000E0, -3.429670709E-2, 0.000000000E0, 9.732849308E-2, -0.000000000E0, 2.780814088E-1, -2.648394370E-2, 1.184104446E-3 ],
    [ 8.500000000E0, -2.317345073E-2, 0.000000000E0, 1.251366340E-1, -4.634690147E-3, 2.251135214E-1, -1.324197185E-2, 1.960082189E-3 ],
    [ 8.600000000E0, -9.269380294E-3, -9.269380294E-4, 1.436753946E-1, -4.634690147E-3, 1.324197185E-2, 1.324197185E-2, 2.583012419E-3 ],
    [ 8.700000000E0, 5.561628176E-3, -9.269380294E-4, 1.297713241E-1, -0.000000000E0, -2.383554933E-1, 2.648394370E-2, 2.105074570E-3 ],
    [ 8.800000000E0, 1.668488453E-2, -9.269380294E-4, 9.269380294E-2, -0.000000000E0, -3.178073244E-1, -0.000000000E0, 1.074017638E-3 ],
    [ 8.900000000E0, 2.410038876E-2, -9.269380294E-4, 6.488566206E-2, -0.000000000E0, -3.442912681E-1, -0.000000000E0, 5.262686426E-4 ],
    [ 9.000000000E0, 2.966201694E-2, -9.269380294E-4, 2.780814088E-2, -0.000000000E0, -4.237430991E-1, 2.648394370E-2, 9.666158741E-5 ],
    [ 9.100000000E0, 2.966201694E-2, -9.269380294E-4, -2.317345073E-2, 4.634690147E-3, -3.575332399E-1, 1.324197185E-2, 6.981114646E-5 ],
    [ 9.200000000E0, 2.502732679E-2, 0.000000000E0, -4.634690147E-2, 4.634690147E-3, -2.118715496E-1, -1.324197185E-2, 2.711894536E-4 ],
    [ 9.300000000E0, 2.039263665E-2, 0.000000000E0, -6.025097191E-2, -0.000000000E0, -1.191777466E-1, -2.648394370E-2, 4.537724520E-4 ],
    [ 9.400000000E0, 1.297713241E-2, 0.000000000E0, -7.415504235E-2, -0.000000000E0, -7.945183109E-2, -2.648394370E-2, 6.873712882E-4 ],
    [ 9.500000000E0, 5.561628176E-3, 0.000000000E0, -7.415504235E-2, -4.634690147E-3, 0.000000000E0, -1.324197185E-2, 6.900563323E-4 ],
    [ 9.600000000E0, -1.853876059E-3, -9.269380294E-4, -7.415504235E-2, -4.634690147E-3, 1.059357748E-1, 1.324197185E-2, 6.900563323E-4 ],
    [ 9.700000000E0, -9.269380294E-3, -9.269380294E-4, -5.561628176E-2, -0.000000000E0, 1.324197185E-1, 5.296788739E-2, 3.866463496E-4 ],
    [ 9.800000000E0, -1.297713241E-2, -9.269380294E-4, -4.171221132E-2, 4.634690147E-3, 2.251135214E-1, -1.324197185E-2, 2.201736158E-4 ],
    [ 9.900000000E0, -1.761182256E-2, 0.000000000E0, -1.853876059E-2, -0.000000000E0, 1.589036622E-1, -0.000000000E0, 4.296070551E-5 ],
    [ 1.000000000E1, -1.668488453E-2, -9.269380294E-4, 0.000000000E0, -0.000000000E0, 1.853876059E-1, 2.648394370E-2, 0.000000000E0 ],
    [ 1.010000000E1, -1.761182256E-2, 0.000000000E0, 9.269380294E-3, 9.269380294E-3, 1.324197185E-1, -2.648394370E-2, 2.148035276E-5 ],
    [ 1.020000000E1, -1.483100847E-2, 9.269380294E-4, 3.244283103E-2, -4.634690147E-3, 9.269380294E-2, -6.620985924E-2, 1.342522047E-4 ],
    [ 1.030000000E1, -1.112325635E-2, -9.269380294E-4, 2.780814088E-2, -9.269380294E-3, 0.000000000E0, -0.000000000E0, 1.074017638E-4 ],
    [ 1.040000000E1, -9.269380294E-3, -9.269380294E-4, 2.780814088E-2, -0.000000000E0, 2.648394370E-2, 5.296788739E-2, 9.666158741E-5 ],
    [ 1.050000000E1, -5.561628176E-3, -9.269380294E-4, 3.707752117E-2, -0.000000000E0, 0.000000000E0, -0.000000000E0, 1.718428221E-4 ],
    [ 1.060000000E1, -1.853876059E-3, -9.269380294E-4, 2.780814088E-2, -0.000000000E0, -1.324197185E-1, -0.000000000E0, 9.666158741E-5 ],
    [ 1.070000000E1, -5.551115123E-17, -9.269380294E-4, 9.269380294E-3, -0.000000000E0, -1.589036622E-1, 2.648394370E-2, 1.074017638E-5 ],
    [ 1.080000000E1, -5.551115123E-17, -9.269380294E-4, -4.634690147E-3, 4.634690147E-3, -6.620985924E-2, 1.324197185E-2, 5.370088189E-6 ],
    [ 1.090000000E1, -9.269380294E-4, 0.000000000E0, -4.634690147E-3, 4.634690147E-3, 1.324197185E-2, -1.324197185E-2, 5.370088189E-6 ],
    [ 1.100000000E1, -9.269380294E-4, 0.000000000E0, 0.000000000E0, -0.000000000E0, 5.296788739E-2, -5.296788739E-2, 0.000000000E0 ],
    [ 1.110000000E1, -9.269380294E-4, 0.000000000E0, 4.634690147E-3, -4.634690147E-3, -1.324197185E-2, 1.324197185E-2, 5.370088189E-6 ],
    [ 1.120000000E1, -5.551115123E-17, -9.269380294E-4, 0.000000000E0, -0.000000000E0, 0.000000000E0, -0.000000000E0, 0.000000000E0 ],
    [ 1.130000000E1, -9.269380294E-4, 0.000000000E0, 0.000000000E0, -0.000000000E0, -2.648394370E-2, 2.648394370E-2, 0.000000000E0 ],
    [ 1.140000000E1, -5.551115123E-17, -9.269380294E-4, 0.000000000E0, -0.000000000E0, , , 0.000000000E0 ],
    [ 1.150000000E1, -9.269380294E-4, 0.000000000E0, , , , , ]
  ]
};