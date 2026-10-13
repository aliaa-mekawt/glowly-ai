import { AcademyLesson } from '../types';

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'lesson-1',
    level: 'beginner',
    title: 'Skin Prep Before Makeup: The Foundation of Any Look',
    durationMinutes: 8,
    category: 'prep',
    overview: 'Learn how proper hydration, gentle exfoliation, and targeted skin prep prevent makeup from clinging to dry patches, separating, or turning oily.',
    steps: [
      {
        title: '1. Gentle Cleansing & Thermal Mist',
        instruction: 'Start with clean skin using a hydrating non-stripping cleanser. Pat gently, leaving skin slightly damp before hydrating mist or essence.',
        proTip: 'Never apply makeup directly to dehydrated, unwashed skin—it forces foundation to soak into dry fissures.',
      },
      {
        title: '2. Lightweight Water-Burst Hydration',
        instruction: 'Apply a humectant serum (Hyaluronic Acid or Glycerin) followed by a lightweight gel-cream. Focus on outer cheeks and under-eyes.',
        proTip: 'Wait 2 to 3 minutes for your moisturizer to sink in before moving to sunscreen or primer.',
      },
      {
        title: '3. Non-Pilling Sunscreen or Primer',
        instruction: 'Use an oil-free, water-burst sunscreen. If using a primer, apply a nickel-sized amount only where needed (pores around nose, oily T-zone).',
        proTip: 'Match primer bases to foundation: silicone primer + silicone foundation, or water primer + water foundation.',
      },
    ],
    requiredTools: ['Clean fingertips', 'Damp sponge', 'Hydrating moisturizer', 'SPF 30+'],
    practiceExercise: 'Complete your morning prep, wait 3 minutes, then touch your cheeks. Your skin should feel plump, supple, and non-tacky before makeup application.',
    commonMistakes: [
      'Applying foundation immediately after heavy face oil, causing slipping and separation.',
      'Skipping moisturizer on oily skin, which paradoxically triggers rebound oiliness later in the day.',
    ],
    image: '/src/assets/images/skincare_routine_flatlay_1791894053876.jpg',
  },
  {
    id: 'lesson-2',
    level: 'beginner',
    title: 'The Essential Tools: Brushes, Sponges & How to Clean Them',
    durationMinutes: 10,
    category: 'prep',
    overview: 'Demystify cosmetic brushes and beauty sponges. Master which density, bristle shape, and application angle gives a streak-free, airbrushed finish.',
    steps: [
      {
        title: '1. The Damp Beauty Sponge',
        instruction: 'Submerge your teardrop sponge under running water until it expands to twice its size, then squeeze thoroughly in a clean towel. It should feel cool and damp, never dripping.',
        proTip: 'Use a bouncing (stippling) motion, never a dragging or wiping motion.',
      },
      {
        title: '2. Dense Buffing Brush vs. Fluffy Powder Brush',
        instruction: 'Flat-top or angled kabuki brushes provide medium-to-full coverage by pressing foundation into the skin. Fluffy, loose brushes distribute powder evenly without cakey buildup.',
      },
      {
        title: '3. Weekly Tool Hygiene',
        instruction: 'Wash sponges after every 2-3 uses with an antibacterial or solid cleansing soap. Clean brushes weekly to prevent bacterial breakouts.',
      },
    ],
    requiredTools: ['Teardrop makeup sponge', 'Dense complexion brush', 'Small tapered setting brush', 'Gentle brush cleanser'],
    practiceExercise: 'Practice applying a dime of lotion to the back of your hand using both fingers and a damp sponge. Compare the diffused edge difference.',
    commonMistakes: [
      'Using a bone-dry makeup sponge, which sucks up your expensive foundation instead of blending it.',
      'Drying brushes with bristles facing up, which allows water into the ferrule and dissolves brush glue.',
    ],
    image: '/src/assets/images/makeup_academy_brushes_1791894054210.jpg',
  },
  {
    id: 'lesson-3',
    level: 'beginner',
    title: 'Identifying Your Skin Undertone & Foundation Match',
    durationMinutes: 12,
    category: 'base',
    overview: 'Understand the difference between surface tone and deep undertone (Cool, Warm, Neutral, Olive) so you never buy an ashy or orange foundation again.',
    steps: [
      {
        title: '1. The Natural Daylight Vein Check',
        instruction: 'Look at the inside of your wrist in indirect natural daylight. Blue or purple veins indicate Cool; green or olive-tinged veins indicate Warm; blue-green mix indicates Neutral.',
        proTip: 'Never test foundation shades in yellow department store lighting or dark rooms.',
      },
      {
        title: '2. The Jawline Swatch Technique',
        instruction: 'Swipe three candidate shades from your lower cheek down onto your neck. The correct shade is the one that disappears seamlessly into both your face and your neck.',
      },
      {
        title: '3. Understanding Oxidation',
        instruction: 'Wait 10 minutes after applying the swatch before judging the shade. Many liquid foundations deepen slightly as they dry down and react with air.',
      },
    ],
    requiredTools: ['Natural daylight mirror', '3 sample shades', 'Wet wipe'],
    practiceExercise: 'Examine your collarbone, neck, and inner forearm in natural daylight tomorrow at 11 AM. Note whether your neck is lighter than your face.',
    commonMistakes: [
      'Matching foundation to your face skin only, resulting in a floating mask effect against a paler or deeper neck.',
      'Assuming all pale skin is cool-toned or all deeper skin is warm-toned.',
    ],
    image: '/src/assets/images/makeup_academy_brushes_1791894054210.jpg',
  },
  {
    id: 'lesson-4',
    level: 'intermediate',
    title: 'Flawless Base: Spot Concealing & Strategic Foundation',
    durationMinutes: 14,
    category: 'base',
    overview: 'Move away from heavy all-over foundation masks. Learn the modern editorial method: sheer luminous base paired with high-precision micro-concealing.',
    steps: [
      {
        title: '1. Sheer Out the Center of the Face',
        instruction: 'Place foundation only on the center of the face (around nostrils, chin, center of forehead). Blend outwards toward the hairline so edges remain sheer and invisible.',
      },
      {
        title: '2. The Eye-Lift Concealer Placement',
        instruction: 'Dot a tiny pin-sized drop of concealer on the inner corner of the eye socket and another angled upward at the outer eye corner. Tap into skin with ring finger.',
      },
      {
        title: '3. Pinpoint Blemish Concealing',
        instruction: 'Use a tiny pointed detail brush to place full-coverage concealer directly onto blemishes. Let it sit for 45 seconds to set, then gently feather just the border.',
      },
    ],
    requiredTools: ['Medium-coverage foundation', 'Creamy concealer', 'Small detail brush', 'Damp sponge'],
    practiceExercise: 'Try applying only half your normal foundation quantity tomorrow, relying on pinpoint concealer for redness. Observe how much fresher your skin looks.',
    commonMistakes: [
      'Applying a huge triangle of heavy concealer under the entire eye, which accentuates fine lines.',
      'Blending out the center of a blemish instead of tapping only the outer rim.',
    ],
    image: '/src/assets/images/makeup_academy_brushes_1791894054210.jpg',
  },
  {
    id: 'lesson-5',
    level: 'intermediate',
    title: 'Sculpt & Glow: Cream Blush, Bronzer & Highlighter Placement',
    durationMinutes: 12,
    category: 'cheeks',
    overview: 'Learn how facial anatomy guides contour and blush placement to lift cheekbones, add natural warmth, and create an ethereal lit-from-within sheen.',
    steps: [
      {
        title: '1. Bronzer for Sun-Kissed Warmth',
        instruction: 'Sweep warm bronzer where the sun naturally hits: hairline, high temples, and across the bridge of the nose. Keep it 2 fingers away from mouth corners.',
      },
      {
        title: '2. Liquid Blush for Lift',
        instruction: 'Rather than smiling and placing blush on the round apples (which drops the face when relaxing), tap blush onto the high cheekbone and blend up towards the temple.',
      },
      {
        title: '3. Highlighter on High Planes Only',
        instruction: 'Dab cream highlighter on the highest point of cheekbones, brow bone, and cupid bow. Avoid putting shimmer on textured pores or active blemishes.',
      },
    ],
    requiredTools: ['Angled contour brush', 'Liquid or cream blush', 'Cream highlighter'],
    practiceExercise: 'Place blush on your left cheek using the high-temple lift technique, and on your right cheek using the round apple technique. Take a straight-on photo to see the difference.',
    commonMistakes: [
      'Using a cool grey contour where warm bronze is needed, creating a muddy or dirty illusion.',
      'Placing highlighter over large pores or bumps, which amplifies surface texture.',
    ],
    image: '/src/assets/images/makeup_academy_brushes_1791894054210.jpg',
  },
  {
    id: 'lesson-6',
    level: 'intermediate',
    title: 'The 10-Minute "Clean Girl" Natural Everyday Routine',
    durationMinutes: 10,
    category: 'looks',
    overview: 'A fast, reliable routine for busy mornings, university, or work that highlights your best features without ever looking like heavy makeup.',
    steps: [
      {
        title: '1. Tinted SPF or Skin Tint (2 mins)',
        instruction: 'Massage a glowy skin tint or tinted mineral SPF over face and neck with hands just like moisturizer.',
      },
      {
        title: '2. Strategic Concealer & Brow Gel (3 mins)',
        instruction: 'Dot concealer only at inner eye corners and around nostrils. Brush eyebrows up and set with a clear or tinted laminating brow gel.',
      },
      {
        title: '3. Dual-Use Cheek & Lip Tint (2 mins)',
        instruction: 'Tap a neutral rose or peach cream blush onto cheeks, then dab the remainder directly onto your lips.',
      },
      {
        title: '4. Curl Lashes & Coat of Mascara (2 mins)',
        instruction: 'Curl lashes from the base in three gentle pulses, followed by one coat of brown or black lengthening mascara.',
      },
      {
        title: '5. Hydrating Lip Oil & T-Zone Dusting (1 min)',
        instruction: 'Swipe nourishing tinted lip oil. Dust translucent powder exclusively between brows, side of nose, and chin.',
      },
    ],
    requiredTools: ['Skin tint', 'Concealer', 'Cream blush', 'Brow gel', 'Eyelash curler', 'Mascara', 'Lip oil'],
    practiceExercise: 'Time yourself tomorrow morning completing this 5-step sequence with a smartphone stopwatch.',
    commonMistakes: [
      'Over-powdering the entire face, extinguishing the natural dewiness.',
      'Skipping the eyelash curler—curling opens the eyes 10x more than mascara alone.',
    ],
    image: '/src/assets/images/hero_glowly_beauty_1791894054782.jpg',
  },
  {
    id: 'lesson-7',
    level: 'advanced',
    title: 'Modern Soft Glam for Evenings & Special Occasions',
    durationMinutes: 20,
    category: 'looks',
    overview: 'Elevate your everyday makeup into a refined, photography-ready soft glam with seamless eyeshadow gradients, defined lips, and all-night setting power.',
    steps: [
      {
        title: '1. Flawless Matte-Satin Canvas',
        instruction: 'Build medium foundation coverage. Set under-eyes with a velvet powder puff using micro-fine translucent powder.',
      },
      {
        title: '2. Monochromatic Neutral Eye Smoke',
        instruction: 'Wash a warm taupe through the crease. Deepen the outer V with rich chocolate brown. Press champagne shimmer onto the center eyelid.',
      },
      {
        title: '3. Soft Winged Smudge Liner',
        instruction: 'Use dark espresso gel liner along lash line, then gently smudge with an angled pencil brush and brown shadow for a feline lift without harsh lines.',
      },
      {
        title: '4. Overlined Lip Contour & Velvet Core',
        instruction: 'Outline lips slightly above the cupid bow with a nude-brown pencil, fill in corners, and pat a lighter rosy velvet lipstick in the center.',
      },
      {
        title: '5. Multi-Layer Setting Spray Sandwich',
        instruction: 'Mist setting spray before powder, and again as the final step. Fan dry for 60 seconds.',
      },
    ],
    requiredTools: ['Eyeshadow palette (neutrals)', 'Gel eyeliner', 'Velvet powder puff', 'Nude lip liner', 'Lipstick', 'Setting spray'],
    practiceExercise: 'Try the powder puff press-and-roll technique under one eye, and a fluffy brush under the other. Notice how the puff locks in concealer without creasing.',
    commonMistakes: [
      'Applying dark eyeshadow above the natural orbital bone socket, overwhelming small eyelids.',
      'Overlining the outer mouth corners, which drags down the smile line.',
    ],
    image: '/src/assets/images/hero_glowly_beauty_1791894054782.jpg',
  },
  {
    id: 'lesson-8',
    level: 'beginner',
    title: 'Gentle Double Cleansing & Proper Makeup Removal',
    durationMinutes: 7,
    category: 'removal',
    overview: 'The golden rule of clear skin: how to completely remove waterproof mascara and longwear foundation without tugging or stripping the skin barrier.',
    steps: [
      {
        title: '1. Oil / Balm Cleanser on Dry Skin',
        instruction: 'Always apply cleansing oil or balm onto dry hands and dry face. Massage in gentle circular motions for 60 seconds to break down makeup and sunscreen.',
      },
      {
        title: '2. Emulsify with Lukewarm Water',
        instruction: 'Add a small splash of water to your hands. The oil will turn into a milky white liquid. Massage for 15 seconds to lift impurities from pores, then rinse.',
      },
      {
        title: '3. Second Water-Based Cleanser',
        instruction: 'Follow with your gentle foaming or hydrating gel cleanser to remove residual perspiration and water-soluble impurities.',
      },
    ],
    requiredTools: ['Cleansing balm or micellar water', 'Gentle second cleanser', 'Clean face towel'],
    practiceExercise: 'After your next heavy makeup day, wipe a cotton pad soaked in micellar water across your face after double cleansing—it should come away 100% clean.',
    commonMistakes: [
      'Using harsh abrasive makeup wipes, which micro-tear sensitive facial skin and leave pore-clogging film behind.',
      'Rubbing vigorously on delicate eyelash roots, causing premature eyelash loss.',
    ],
    image: '/src/assets/images/skincare_routine_flatlay_1791894053876.jpg',
  },
];
