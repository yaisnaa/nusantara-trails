/**
 * File lib/api.js
 * Berisi fungsi-fungsi untuk mengambil data (data fetching).
 * Di Tugas 1, fungsi-fungsi ini mengambil data dari file JS lokal.
 * Di Tugas 2, kita tinggal mengganti isinya untuk mengambil data dari Database/API
 * tanpa harus mengubah kode di komponen UI.
 */

import { destinations } from '../data/destinations';
import { stories } from '../data/stories';

/**
 * Mengambil semua data destinasi.
 * @returns {Array} List destinasi
 */
export function getAllDestinations() {
  // Simulasi fetch data
  return destinations;
}

/**
 * Mengambil satu destinasi berdasarkan slug-nya.
 * @param {string} slug 
 * @returns {Object|undefined} Data destinasi
 */
export function getDestinationBySlug(slug) {
  return destinations.find((item) => item.slug === slug);
}

/**
 * Mengambil destinasi berdasarkan wilayah (region).
 * @param {string} region 
 * @returns {Array} List destinasi di wilayah tersebut
 */
export function getDestinationsByRegion(region) {
  if (!region || region === 'All') return destinations;
  return destinations.filter((item) => item.region.includes(region));
}

/**
 * Mengambil semua data artikel budaya.
 * @returns {Array} List cerita/artikel
 */
export function getAllStories() {
  return stories;
}

/**
 * Mengambil destinasi unggulan untuk ditampilkan di Homepage.
 * @param {number} limit 
 * @returns {Array} List destinasi terbatas
 */
export function getFeaturedDestinations(limit = 6) {
  return destinations.slice(0, limit);
}
