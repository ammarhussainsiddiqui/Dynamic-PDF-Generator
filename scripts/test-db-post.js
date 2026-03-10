const mongoose = require('mongoose');

async function testMongoose() {
  await mongoose.connect("mongodb+srv://itisdevandmarketing_db_user:o1qu4ftKe21bUwQM@cluster0.tsk9air.mongodb.net/pdf_generator?retryWrites=true&w=majority");
  
  const TemplateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
  }, { timestamps: true });

  const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);
  
  try {
    const template = await Template.create({
      userId: new mongoose.Types.ObjectId('69af4067971434ff1ad2ba59'),
      name: "Server Test"
    });
    console.log("Success:", template);
  } catch(e) {
    console.error("Mongoose Error:", e);
  }
  process.exit(0);
}

testMongoose();
