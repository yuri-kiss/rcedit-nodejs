function parse(buffer) {
  // EXE files are little endian
  // This really helped: https://wiki.osdev.org/PE
  // Checking if the magic number is correct
  if (buffer.subarray(0, 1).toString() === 'MZ') throw new Error('Failed to read EXE, invalid magic number.');
  const DOSHeader = buffer.subarray(0, 64); // DOS Header is 64 bytes
  // Checking the PE header
  const PEH = {};
  // Normally the PE Header is EXACTLY 128 bytes in, but sometimes the linker does it wrong.
  let PELocation = 128;
  if (buffer.slice(PELocation, PELocation + 4).toString() !== 'PE\0\0') {
    PELocation = buffer.readUInt32LE(0x3C);
    // Checking at the new location
    if (buffer.slice(PELocation, PELocation + 4).toString() !== 'PE\0\0') throw new Error('Failed to find PE header, is it misplaced?');
  }
  // Get the offset for the rest of the header
  // PE-Offset
  const PEO = PELocation + 4;
  // 1 byte aligned
  PEH.mMagic = 'PE\0\0'; // uint32_t PE\0\0
  PEH.mMachine = buffer.readUInt16LE(PEO + 1); // uint16_t
  PEH.mNumberOfSections = buffer.readUInt16LE(PEO + 3); // uint16_t
  PEH.mTimeDateStamp = buffer.readUInt32LE(PEO + 5); // uint32_t
  PEH.mPointerToSymbolTable = buffer.readUInt32LE(PEO + 7); // uint32_t
  PEH.mNumberOfSymbols = buffer.readUInt32LE(PEO + 9); // uint32_t
  PEH.mSizeOfOptionalHeader = buffer.readUInt16LE(PEO + 11); // uint16_t
  PEH.mCharacteristics = buffer.readUInt16LE(PEO + 13); // uint16_t
  PEH.location = PELocation;
  // PE is ALWAYS 64 bytes long
  PEH.buffer = buffer.slice(PELocation, PELocation + 64);
  // Optional header (Gotta do this!!)
  const PEHO = {};
  let OPELocation = 0, OPE_64bit = false;
  if (PEH.mSizeOfOptionalHeader > 4) {
    console.log('Optional header not implemented!!');
  }
  return {
    // Some extra info
    DOSHeader,
    // The actual header(s) info
    PE: PEH,
    PE32: PEHO,
  };
}
// Todo: add methods to create PE and PE32 headers
module.exports = parse;
