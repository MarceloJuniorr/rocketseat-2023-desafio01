import assert from 'assert';
import { parse } from 'csv-parse';
import { readFile } from 'fs/promises';

const readCSV = async () => {
  const csvPath = new URL('./import.csv', import.meta.url);

    const fileContents = await readFile(csvPath, 'utf8');
    const parser = parse(fileContents, { columns: true });

    process.stdout.write('start\n');

    for await (const record of parser) {
      const { title, description } = record;
      console.log(title, description);

      const postData = JSON.stringify({
        title,
        description,
      });

      const apiUrl = 'http://localhost:3333/tasks';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: postData,
      });

      if (!response.ok) {
        console.log(`Erro HTTP! Status: ${response.status}`);
      }

      const responseData = response;
      console.log('Resposta do servidor:', responseData.status);
    }

    process.stdout.write('...done\n');

};

readCSV();
