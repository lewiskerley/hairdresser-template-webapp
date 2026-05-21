const BASE = 'https://images.unsplash.com/photo-';

export const galleryByType = {
  barber: [
    { id: '1503951914875-452162b0f3f1', alt: 'Barber with scissors' },
    { id: '1599351431202-1e0f0137899a', alt: 'Beard styling' },
    { id: '1621605815971-fbc98d665033', alt: 'Skin fade detail' },
    { id: '1622286342621-4bd786c2447c', alt: 'Barbershop interior' },
    { id: '1614850523459-c2f4ec699168', alt: 'Modern barbershop chair' },
    { id: '1605497788044-5a32c7078486', alt: 'Haircut in progress' },
  ],
  hairdresser: [
    { id: '1560066984-138dadb4c035', alt: 'Hair salon interior' },
    { id: '1522337360788-8b13dee7a37e', alt: 'Hair styling session' },
    { id: '1562322140-8baeececf3df', alt: 'Long hair treatment' },
    { id: '1595476108010-b4d1f102b1b1', alt: 'Blonde highlights' },
    { id: '1519699047748-de8e457a634e', alt: 'Colour treatment' },
    { id: '1492106087820-71f1a00d2b11', alt: 'Salon styling station' },
  ],
};

export function imgUrl(id, w = 800) {
  return `${BASE}${id}?w=${w}&q=80&fit=crop&auto=format`;
}
