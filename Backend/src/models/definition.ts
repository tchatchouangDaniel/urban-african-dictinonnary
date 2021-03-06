/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/extensions
import Client from '../database';
// TODO: create a show that only show definition for a particular user id
export type Definition = {
  id: number;
  author_id: string;
  category_id: number;
  category_letter_id: number;
  title: string;
  description: string;
  exemple: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  up_votes: number;
  down_votes: number;
  vote_score: number;
};

export class DefinitionStore {
  async index(): Promise<Definition[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM definition';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch all the definitions : ${error}`);
    }
  }

  // TODO create a show that only show definition for a particular user id

  async indexUser(authorId: string | number): Promise<Definition[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM definition WHERE author_id=($1)';
      const result = await conn.query(sql, [authorId]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch this user definitions : ${error}`);
    }
  }

  async show(id: number | string): Promise<Definition> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM definition WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to fetch the definition : ${error}`);
    }
  }

  async delete(id: number | string): Promise<Definition> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM definition WHERE id=($1) RETURNING *';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to delete the definition : ${error}`);
    }
  }

  async create(
    authorId: string,
    categoryId: number,
    categoryLetterId: number,
    title: string,
    description: string,
    exemple: string,
    published: boolean = true,
    createdAt: string,
    updatedAt: string,
    upVotes: number = 0,
    downVotes: number = 0,
    voteScore: number = 0
  ): Promise<Definition> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO definition (author_id,category_id,category_letter_id,title,description,exemple,published,created_at,updated_at,up_votes,down_votes,vote_score) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *';
      const result = await conn.query(sql, [
        authorId,
        categoryId,
        categoryLetterId,
        title,
        description,
        exemple,
        published,
        createdAt,
        updatedAt,
        upVotes,
        downVotes,
        voteScore,
      ]);

      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create the definition : ${error}`);
    }
  }

  async update(
    id: number | string,
    title: string,
    description: string,
    exemple: string,
    updatedAt: string
  ): Promise<Definition> {
    try {
      const conn = await Client.connect();
      const sqlExisting =
        'SELECT title, description, updated_at from definition WHERE id=($1)';
      const resultExist = await conn.query(sqlExisting, [id]);
      const titleExist = resultExist.rows[0].title === title ? title : title;
      const descExist =
        resultExist.rows[0].description === description
          ? description
          : description;
      const updExist =
        resultExist.rows[0].updatedAt === updatedAt ? updatedAt : updatedAt;
      const exExist =
        resultExist.rows[0].exemple === exemple ? exemple : exemple;
      const sql =
        'UPDATE definition SET title=($1), description=($2), exemple=($3), updated_at=($4) WHERE id=($5)';
      await conn.query(sql, [titleExist, descExist, exExist, updExist, id]);
      const sqlAfterUpdate = 'SELECT * from definition WHERE id=($1)';
      const resultAfter = await conn.query(sqlAfterUpdate, [id]);
      conn.release();
      return resultAfter.rows[0];
    } catch (error) {
      throw new Error(`Unable to update the definition : ${error}`);
    }
  }
}
