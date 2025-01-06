import snowflake from 'snowflake-id'

class UniqueIdGenerator {
  private static instance: UniqueIdGenerator
  private mid = (2025 - 1970) * 31536000 * 1000
  private offset = null
  private snowFlakeInstance = null

  private constructor() {
    // Private constructor to restrict direct instantiation
    this.snowFlakeInstance = new snowflake({
      mid: this.mid,
      offset: this.offset,
    })
  }

  public static getInstance(): UniqueIdGenerator {
    // Method to get the single instance
    if (!UniqueIdGenerator.instance) {
      UniqueIdGenerator.instance = new UniqueIdGenerator()
    }
    return UniqueIdGenerator.instance
  }

  public generateId(): string {
    // Expose method for ID generation
    return this.snowFlakeInstance.generate().toString()
  }
}

const idGenerator = UniqueIdGenerator.getInstance()

export default idGenerator
