import destPokhara from '../assets/dest-pokhara.jpg';
import destAnnapurna from '../assets/dest-annapurna.jpg';
import destEverest from '../assets/dest-everest.jpg';
import destMustang from '../assets/dest-mustang.jpg';
import destChitwan from '../assets/dest-chitwan.jpg';
import destBandipur from '../assets/dest-bandipur.jpg';
import destKathmandu from '../assets/dest-kathmandu.jpg';
import heroBg from '../assets/hero-bg.jpg';

export function getDestinationImage(destinationName = '', title = '') {
  const q = `${destinationName} ${title}`.toLowerCase();
  if (
    q.includes('pokhara') ||
    q.includes('phewa') ||
    q.includes('sarangkot') ||
    q.includes('begnas')
  ) {
    return destPokhara;
  }
  if (
    q.includes('chitwan') ||
    q.includes('sauraha') ||
    q.includes('safari') ||
    q.includes('rapti')
  ) {
    return destChitwan;
  }
  if (
    q.includes('bandipur') ||
    q.includes('tanahun') ||
    q.includes('dumre')
  ) {
    return destBandipur;
  }
  if (
    q.includes('kathmandu') ||
    q.includes('ktm') ||
    q.includes('patan') ||
    q.includes('bhaktapur') ||
    q.includes('durbar') ||
    q.includes('thamel') ||
    q.includes('boudha')
  ) {
    return destKathmandu;
  }
  if (
    q.includes('annapurna') ||
    q.includes('abc') ||
    q.includes('thorong') ||
    q.includes('mardi') ||
    q.includes('poon hill') ||
    q.includes('ghorepani') ||
    q.includes('langtang')
  ) {
    return destAnnapurna;
  }
  if (
    q.includes('everest') ||
    q.includes('ebc') ||
    q.includes('kala patthar') ||
    q.includes('gokyo') ||
    q.includes('solukhumbu')
  ) {
    return destEverest;
  }
  if (
    q.includes('mustang') ||
    q.includes('lo manthang') ||
    q.includes('muktinath') ||
    q.includes('jomsom')
  ) {
    return destMustang;
  }
  return heroBg;
}

export function calculateDurationDays(startDate, endDate) {
  if (!startDate || !endDate) return null;
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? `${diffDays} Days` : '1 Day';
  } catch {
    return null;
  }
}

export function getDifficulty(trip) {
  if (trip.difficulty_level) {
    const d = trip.difficulty_level.toLowerCase();
    if (d.includes('easy')) return { label: 'Easy', icon: '🚶', className: 'diff-easy' };
    if (d.includes('mod')) return { label: 'Moderate', icon: '🏔️', className: 'diff-moderate' };
    if (d.includes('chal')) return { label: 'Challenging', icon: '🧗', className: 'diff-challenging' };
    if (d.includes('stren') || d.includes('hard')) return { label: 'Strenuous', icon: '⛰️', className: 'diff-strenuous' };
  }
  const style = (trip.travel_style || '').toLowerCase();
  if (style === 'cultural' || style === 'relaxation') {
    return { label: 'Easy / Leisure', icon: '🚶', className: 'diff-easy' };
  }
  const dest = `${trip.destination_name || ''} ${trip.title || ''}`.toLowerCase();
  if (dest.includes('everest') || dest.includes('ebc') || dest.includes('thorong') || dest.includes('manaslu')) {
    return { label: 'Challenging', icon: '🧗', className: 'diff-challenging' };
  }
  if (dest.includes('annapurna') || dest.includes('mustang') || dest.includes('langtang')) {
    return { label: 'Moderate', icon: '🏔️', className: 'diff-moderate' };
  }
  if (dest.includes('kathmandu') || dest.includes('chitwan') || dest.includes('bandipur') || dest.includes('lumbini') || dest.includes('pokhara')) {
    return { label: 'Easy', icon: '🚶', className: 'diff-easy' };
  }
  return { label: 'Easy', icon: '🚶', className: 'diff-easy' };
}
